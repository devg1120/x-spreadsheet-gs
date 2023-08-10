import { stringAt } from '../core/alphabet';
import { indexAt } from '../core/alphabet';
import { getFontSizePxByPt } from '../core/font';
import _cell from '../core/cell';
import { formulam } from '../core/formula';
import { formatm } from '../core/format';
import helper from '../core/helper';
import { makeShape }  from '../diagram/shape';

import Konva from 'konva';
import {
  Draw, DrawBox, thinLineWidth, npx,
} from '../canvas/draw_konva';

// gobal var
const cellPaddingWidth = 5;
const tableFixedHeaderCleanStyle = { fillStyle: '#f4f5f8' };
const tableGridStyle = {
  fillStyle: '#fff',
  lineWidth: thinLineWidth,
  strokeStyle: '#e6e6e6',
};

function tableFixedHeaderStyle() {
  return {
    textAlign: 'center',
    textBaseline: 'middle',
    font: `500 ${npx(12)}px Source Sans Pro`,
    fillStyle: '#585757',
    lineWidth: thinLineWidth(),
    strokeStyle: '#e6e6e6',
  };
}

function getDrawBox(rindex, cindex) {
  const { data } = this;
  const {
    left, top, width, height,
  } = data.cellRect(rindex, cindex);
  return new DrawBox(left, top, width, height, cellPaddingWidth);
}


function add_layerd_Line_by_address ( name, s_address, e_address) {
   var s_alphabets  = s_address.match( /^[A-Z]*/ );
   var s_number     = s_address.match( /[0-9]*$/ );

   var e_alphabets  = e_address.match( /^[A-Z]*/ );
   var e_number     = e_address.match( /[0-9]*$/ );

   let s_c_index = indexAt(s_alphabets[0]);
   let s_r_index = parseInt(s_number[0], 10)-1 ;

   let e_c_index = indexAt(e_alphabets[0]);
   let e_r_index = parseInt(e_number[0], 10)-1 ;

   add_layerd_Line.call(this,  name, s_r_index, s_c_index, e_r_index, e_c_index) ;
}

function add_layerd_Shape_by_address ( name, address) {

   var alphabets  = address.match( /^[A-Z]*/ );
   var number     = address.match( /[0-9]*$/ );

  
   let c_index = indexAt(alphabets[0]);
   let r_index = parseInt(number[0], 10) -1;

  // console.log(name, address, c_index, r_index);
   
   add_layerd_Shape.call(this,  name, r_index, c_index) ;

}

function move(_layer_cell, shape, width, height, rindex, cindex) {

  shape.func1(shape);
  _layer_cell.some(function(element) { 

  if (element.shape === shape) {
         //console.log("element: ", element);
         element.shape.children[0].width( width );  // children[0] = Rect
         element.shape.children[0].height( height );  // children[0] = Rect
         element.data.rindex = rindex;
         element.data.cindex = cindex;

         let cell_address = stringAt(cindex) + String(rindex + 1);
         element.shape.children[1].text(element.data.name + " / " + cell_address);
         return true;
    }

  });//forEach
}

function move_layerd_Shape( name, shape, rindex, cindex) {
  //console.log("move_layerd_Shape:", rindex, cindex　);

  const {  data, layer , layer_cell} = this;
  const {  layer_TOP_LEFT , layer_cell_TOP_LEFT} = this;
  const {  layer_TOP_RIGHT , layer_cell_TOP_RIGHT} = this;
  const {  layer_BOTTOM_LEFT , layer_cell_BOTTOM_LEFT} = this;
  const {  layer_BOTTOM_RIGHT , layer_cell_BOTTOM_RIGHT} = this;

  let {
    left, top, width, height,
   } = data.cellRect(rindex , cindex);
   
    let shape_BOTTOM_LEFT;
    let shape_BOTTOM_RIGHT;
    let shape_TOP_LEFT;
    let shape_TOP_RIGHT;

  shape.clones.forEach(function( shape ) {
     if ( shape.plain == "BOTTOM_LEFT" ) { shape_BOTTOM_LEFT  = shape;}
     if ( shape.plain == "BOTTOM_RIGHT") { shape_BOTTOM_RIGHT = shape;}
     if ( shape.plain == "TOP_LEFT"    ) { shape_TOP_LEFT     = shape;}
     if ( shape.plain == "TOP_RIGHT"   ) { shape_TOP_RIGHT    = shape;}
   });

   move.call(this, layer_cell_BOTTOM_RIGHT, shape_BOTTOM_RIGHT, width, height, rindex, cindex);
   move.call(this, layer_cell_BOTTOM_LEFT,  shape_BOTTOM_LEFT,  width, height, rindex, cindex);
   move.call(this, layer_cell_TOP_RIGHT,    shape_TOP_RIGHT,    width, height, rindex, cindex);
   move.call(this, layer_cell_TOP_LEFT,     shape_TOP_LEFT,     width, height, rindex, cindex);


 this.render();
 data.changeData( () => {});
}
/*
function sync_move_layerd_Shape( name, shape, rindex, cindex) {

   console.log("sync_move_layerd_Shape");

}
*/
/*
class Shape extends Konva.Group{
  constructor(dateStr) {
    super(dateStr);
    this.clones = [];
    this.clones.push(this);
    this.plain ="";
  }
  clone() {

    const obj = super.clone();
    obj.clones = this.clones;
    this.clones.push(obj);
    return obj;
  }
  func1() {
    console.log("call func1");
  }

}
*/

function add_layerd_Line( pdata) {
  const {  data, layer , layer_cell} = this;
  const {  layer_TOP_LEFT , layer_line_TOP_LEFT} = this;
  const {  layer_TOP_RIGHT , layer_line_TOP_RIGHT} = this;
  const {  layer_BOTTOM_LEFT , layer_line_BOTTOM_LEFT} = this;
  const {  layer_BOTTOM_RIGHT , layer_line_BOTTOM_RIGHT} = this;
 
  //console.log("add_layerd_Line", name, srindex, scindex, erindex, ecindex);

  let sr = data.cellRect(pdata.srindex, pdata.scindex);

  let s_left = sr.left;
  let s_top = sr.top;
  let s_width = sr.width;
  let s_height = sr.height

  let er = data.cellRect(pdata.erindex, pdata.ecindex);

  let e_left = er.left;
  let e_top = er.top;
  let e_width = er.width;
  let e_height = er.height

  //console.log(s_left, s_top, s_width, s_height)
  //console.log(e_left, e_top, e_width, e_height)

  let left_pad = data.cols.indexWidth;
  let top_pad = data.rows.height;

  const points = [
                   left_pad + s_left + s_width, top_pad + s_top + s_height/2,
                   left_pad + e_left          , top_pad + e_top + e_height/2,
                 ];

  var line1 = new Konva.Line({
                  points: points,
                  stroke: 'red',
                  strokeWidth: 1,
                  lineCap: 'round',
                  lineJoin: 'round'
                });

   let line2 = line1.clone();
   let line3 = line1.clone();
   let line4 = line1.clone();

   layer_TOP_LEFT.add(line1);
   layer_TOP_RIGHT.add(line2);
   layer_BOTTOM_LEFT.add(line3);
   layer_BOTTOM_RIGHT.add(line4);

   line1.plain = "TOP_LEFT"
   line2.plain = "TOP_RIGHT"
   line3.plain = "BOTTOM_LEFT"
   line4.plain = "BOTTOM_RIGHT"

   layer_line_TOP_LEFT.push({data: pdata, line: line1,}); 
   layer_line_TOP_RIGHT.push({data: pdata, line: line2,}); 
   layer_line_BOTTOM_LEFT.push({data: pdata, line: line3,}); 
   layer_line_BOTTOM_RIGHT.push({data: pdata, line: line4,}); 
}

function add_layerd_Shape( shape_data) {
  const {  data, layer , layer_cell} = this;
  const {  layer_TOP_LEFT , layer_cell_TOP_LEFT} = this;
  const {  layer_TOP_RIGHT , layer_cell_TOP_RIGHT} = this;
  const {  layer_BOTTOM_LEFT , layer_cell_BOTTOM_LEFT} = this;
  const {  layer_BOTTOM_RIGHT , layer_cell_BOTTOM_RIGHT} = this;


  
  let {
    left, top, width, height,
   } = data.cellRect(shape_data.rindex , shape_data.cindex);
   
  //console.log(left, top, width, height)

  let left_pad = data.cols.indexWidth;
  let cell_address = stringAt(shape_data.cindex) + String(shape_data.rindex +1 );

  var shape1 = makeShape({
    left: left,
    top: top,
    width: width,
    height: height,
    left_pad: left_pad,
    cell_address: cell_address,

  }, shape_data, data, move_layerd_Shape);
/*
  var shape1 = new Shape({
        x: left + left_pad,
        y: top,
        draggable: true,
        name: pdata.name
      });

  var text = new Konva.Text({
        x: 10,
        y: 3,
        text: pdata.name + " / " + cell_address,
        fontSize: 14,
        fontFamily: 'Calibri',
        fill: 'red'
      });

  var rect = new Konva.Rect({
        x:0,
        y:0,
        width: width,
        height: height,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 0,
        //shadowBlur: 10,
        cornerRadius: 10,
        //rotation: 45,
        opacity: 0.5,
        //globalCompositeOperation: 'xor',
        shadowEnabled: true,
        //draggable: true
   });

   shape1.on('mouseover', function() {
	              document.body.style.cursor = 'pointer';
		            });
   shape1.on('mouseout', function() {
		      document.body.style.cursor = 'default';
			    });

   shape1.on('dragstart', function() {
              //console.log('dragstart');
		            });

   shape1.on('dragend', function(e) {
	      //console.log('dragend', e.target);
	      let x = e.target.attrs.x + e.target.children[0].attrs.width/2;
	      let y = e.target.attrs.y + e.target.children[0].attrs.height/2;
	      //let x = e.target.attrs.x ;
	      //let y = e.target.attrs.y ;
	      const cRect = data.getCellRectByXY(x, y);
                           
                               //Group Layer Table
	      const table = e.target.parent.parent;
	      const name = e.target.attrs.name;
	      const shape = e.target;
	      const rindex = cRect.ri;
	      const cindex = cRect.ci;
              move_layerd_Shape.call(table, name, shape, rindex, cindex);

       });

   shape1.add(rect);
   shape1.add(text);
 */ 
   let shape2 = shape1.clone();
   let shape3 = shape1.clone();
   let shape4 = shape1.clone();

   layer_TOP_LEFT.add(shape1);
   layer_TOP_RIGHT.add(shape2);
   layer_BOTTOM_LEFT.add(shape3);
   layer_BOTTOM_RIGHT.add(shape4);

   shape1.plain = "TOP_LEFT"
   shape2.plain = "TOP_RIGHT"
   shape3.plain = "BOTTOM_LEFT"
   shape4.plain = "BOTTOM_RIGHT"

   layer_cell_TOP_LEFT.push    ( {data: shape_data,shape: shape1}); 
   layer_cell_TOP_RIGHT.push   ( {data: shape_data,shape: shape2}); 
   layer_cell_BOTTOM_LEFT.push ( {data: shape_data,shape: shape3}); 
   layer_cell_BOTTOM_RIGHT.push( {data: shape_data,shape: shape4}); 

}

function layer_render(layer, layer_cell,viewRange, fw, fh, tx, ty){

   const {  data,  } = this;
   let left_pad = this.data.cols.indexWidth;

   layer_cell.forEach(function(element) { 
        if(element.data.rindex >= viewRange.sri && element.data.rindex <= viewRange.eri 
		  && element.data.cindex >= viewRange.sci && element.data.cindex <= viewRange.eci) {
              let {   
                    left, top, width, height, 
                } = data.cellRect(element.data.rindex , element.data.cindex);

              element.shape.absolutePosition( {x:  left + fw +tx, y:  top + fh +ty});

              element.shape.children[0].width( width );  // children[0] = Rect
              element.shape.children[0].height( height );  // children[0] = Rect
                     //暫定処理
              let cell_address = stringAt(element.data.cindex) + String(element.data.rindex + 1);
              element.shape.children[1].text(element.data.name + " / " + cell_address);
              element.shape.show();

         } else {
             element.shape.hide();
         }
                                                                                   
    }); //forEach 

}

function renderCell(rindex, cindex) {
  const { draw, data } = this;
  const { sortedRowMap } = data;
  let nrindex = rindex;
  if (sortedRowMap.has(rindex)) {
    nrindex = sortedRowMap.get(rindex);
  }

  const cell = data.getCell(nrindex, cindex);
  if (cell === null) return;

  const style = data.getCellStyleOrDefault(nrindex, cindex);
  // console.log('style:', style);
  const dbox = getDrawBox.call(this, rindex, cindex);
  dbox.bgcolor = style.bgcolor;
  if (style.border !== undefined) {
    dbox.setBorders(style.border);
    // bboxes.push({ ri: rindex, ci: cindex, box: dbox });
    draw.strokeBorders(dbox);
  }
  draw.rect(dbox, () => {
    // render text
    let cellText = _cell.render(cell.text || '', formulam, (y, x) => (data.getCellTextOrDefault(x, y)));
    if (style.format) {
      // console.log(data.formatm, '>>', cell.format);
      cellText = formatm[style.format].render(cellText);
    }
    const font = Object.assign({}, style.font);
    font.size = getFontSizePxByPt(font.size);
    // console.log('style:', style);
    draw.text(cellText, dbox, {
      align: style.align,
      valign: style.valign,
      font,
      color: style.color,
      strike: style.strike,
      underline: style.underline,
    }, style.textwrap);
    // error
    const error = data.validations.getError(rindex, cindex);
    if (error) {
      // console.log('error:', rindex, cindex, error);
      draw.error(dbox);
    }
  });
}

function renderAutofilter(viewRange) {
  const { data, draw } = this;
  if (viewRange) {
    const { autoFilter } = data;
    if (!autoFilter.active()) return;
    const afRange = autoFilter.hrange();
    if (viewRange.intersects(afRange)) {
      afRange.each((ri, ci) => {
        const dbox = getDrawBox.call(this, ri, ci);
        draw.dropdown(dbox);
      });
    }
  }
}

function renderContent( viewRange, fw, fh, tx, ty) {
  const { draw, data , layer} = this;
  draw.save();
  draw.translate(fw, fh)
    .translate(tx, ty);

// layer.offsetX(fw+tx);
// layer.offsetY(fh+ty);

  const { exceptRowSet } = data;
  const filteredTranslateFunc = (ri) => {
    const ret = exceptRowSet.has(ri);
    if (ret) {
      const height = data.rows.getHeight(ri);
      draw.translate(0, -height);
    }
    return !ret;
  };
  // 1 render cell
  // let bboxes = [];
  draw.save();
  viewRange.each((ri, ci) => {
    renderCell.call(this, ri, ci);
  }, ri => filteredTranslateFunc(ri));
  draw.restore();




  // 2 render cell border
  // draw.save();
  // renderCellBorders.call(this, bboxes, (ri) => filteredTranslateFunc(ri));
  // draw.restore();

  // / bboxes = [];
  // 3 render mergeCell
  const rset = new Set();
  draw.save();
  data.eachMergesInView(viewRange, ({ sri, sci, eri }) => {
    if (!exceptRowSet.has(sri)) {
      renderCell.call(this, sri, sci);
    } else if (!rset.has(sri)) {
      rset.add(sri);
      const height = data.rows.sumHeight(sri, eri + 1);
      draw.translate(0, -height);
    }
  });
  draw.restore();

  // 4 render mergeCell border
  // draw.save();
  // renderCellBorders.call(this, bboxes, (ri) => filteredTranslateFunc(ri));
  // draw.restore();

  // 5 render autofilter
  renderAutofilter.call(this, viewRange);

  draw.restore();
}

function renderSelectedHeaderCell(x, y, w, h) {
  const { draw } = this;
  draw.save();
  draw.attr({ fillStyle: 'rgba(75, 137, 255, 0.08)' })
    .fillRect(x, y, w, h);
  draw.restore();
}

// viewRange
// type: all | left | top
// w: the fixed width of header
// h: the fixed height of header
// tx: moving distance on x-axis
// ty: moving distance on y-axis
function renderFixedHeaders(type, viewRange, w, h, tx, ty) {
  const { draw, data } = this;
  const sumHeight = viewRange.h; // rows.sumHeight(viewRange.sri, viewRange.eri + 1);
  const sumWidth = viewRange.w; // cols.sumWidth(viewRange.sci, viewRange.eci + 1);
  const nty = ty + h;
  const ntx = tx + w;

  draw.save();
  // draw rect background
  draw.attr(tableFixedHeaderCleanStyle);
  if (type === 'all' || type === 'left') draw.fillRect(0, nty, w, sumHeight);
  if (type === 'all' || type === 'top') draw.fillRect(ntx, 0, sumWidth, h);

  const {
    sri, sci, eri, eci,
  } = data.selector.range;
  // console.log(data.selectIndexes);
  // draw text
  // text font, align...
  draw.attr(tableFixedHeaderStyle());
  // y-header-text
  if (type === 'all' || type === 'left') {
    data.rowEach(viewRange.sri, viewRange.eri, (i, y1, rowHeight) => {
      const y = nty + y1;
      const ii = i;
      draw.line([0, y], [w, y]);
      if (sri <= ii && ii < eri + 1) {
        renderSelectedHeaderCell.call(this, 0, y, w, rowHeight);
      }
      draw.fillText(ii + 1, w / 2, y + (rowHeight / 2));
    });
    draw.line([0, sumHeight + nty], [w, sumHeight + nty]);
    draw.line([w, nty], [w, sumHeight + nty]);
  }
  // x-header-text
  if (type === 'all' || type === 'top') {
    data.colEach(viewRange.sci, viewRange.eci, (i, x1, colWidth) => {
      const x = ntx + x1;
      const ii = i;
      draw.line([x, 0], [x, h]);
      if (sci <= ii && ii < eci + 1) {
        renderSelectedHeaderCell.call(this, x, 0, colWidth, h);
      }
      draw.fillText(stringAt(ii), x + (colWidth / 2), h / 2);
    });
    draw.line([sumWidth + ntx, 0], [sumWidth + ntx, h]);
    draw.line([0, h], [sumWidth + ntx, h]);
  }
  draw.restore();
}

function renderFixedLeftTopCell(fw, fh) {
  const { draw } = this;
  
  draw.save();
  // left-top-cell
  draw.attr({ fillStyle: '#f4f5f8' })
    .fillRect(0, 0, fw, fh);
  draw.restore();
  
  // konva test
  //draw.konva_test(0, 0, fw, fh);
  //
}

function renderContentGrid({
  sri, sci, eri, eci, w, h,
}, fw, fh, tx, ty) {
  const { draw, data } = this;
  const { settings } = data;

  draw.save();
  draw.attr(tableGridStyle)
    .translate(fw + tx, fh + ty);
  // const sumWidth = cols.sumWidth(sci, eci + 1);
  // const sumHeight = rows.sumHeight(sri, eri + 1);
  // console.log('sumWidth:', sumWidth);
  draw.clearRect(0, 0, w, h);
  if (!settings.showGrid) {
    draw.restore();
    return;
  }
  // console.log('rowStart:', rowStart, ', rowLen:', rowLen);
  data.rowEach(sri, eri, (i, y, ch) => {
    // console.log('y:', y);
    if (i !== sri) draw.line([0, y], [w, y]);
    if (i === eri) draw.line([0, y + ch], [w, y + ch]);
  });
  data.colEach(sci, eci, (i, x, cw) => {
    if (i !== sci) draw.line([x, 0], [x, h]);
    if (i === eci) draw.line([x + cw, 0], [x + cw, h]);
  });
  draw.restore();
}

function renderFreezeHighlightLine(fw, fh, ftw, fth) {
  const { draw, data } = this;
  const twidth = data.viewWidth() - fw;
  const theight = data.viewHeight() - fh;
  draw.save()
    .translate(fw, fh)
    .attr({ strokeStyle: 'rgba(75, 137, 255, .6)' });
  draw.line([0, fth], [twidth, fth]);
  draw.line([ftw, 0], [ftw, theight]);
  draw.restore();
}

/** end */
class Table extends Konva.Stage{
  constructor(el, data) {
    super({
       container: el,   // id of container <div>
       width: data.viewWidth(),
       height: data.viewHeight(),
       //scaleX: 1 / window.devicePixelRatio,
       //scaleY: 1 / window.devicePixelRatio
       scaleX:  window.devicePixelRatio,
       scaleY:  window.devicePixelRatio
    });

    this.el = el;


    this.draw = new Draw(el, data.viewWidth(), data.viewHeight());
    super.add(this.draw);
    this.draw.draw();

    this.data = data;
    this.layer_cell = [];
    this.layer_cell_TOP_LEFT = [];
    this.layer_cell_TOP_RIGHT = [];
    this.layer_cell_BOTTOM_LEFT = [];
    this.layer_cell_BOTTOM_RIGHT = [];

    this.layer_line_TOP_LEFT = [];
    this.layer_line_TOP_RIGHT = [];
    this.layer_line_BOTTOM_LEFT = [];
    this.layer_line_BOTTOM_RIGHT = [];


    //----------------------------------- Konva TEST
    // then create layer
    this.layer = new Konva.Layer();
    this.layer_TOP_LEFT  = new Konva.Layer();
    this.layer_TOP_RIGHT = new Konva.Layer();
    this.layer_BOTTOM_LEFT = new Konva.Layer();
    this.layer_BOTTOM_RIGHT = new Konva.Layer();
    
    // create our shape
    var circle = new Konva.Circle({
      x: 170,
      y: 170,
      radius: 30,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
        draggable: true
    });
    
         circle.on('mouseover', function() {
    	             document.body.style.cursor = 'pointer';
    		           });
         circle.on('mouseout', function() {
    	              document.body.style.cursor = 'default';
    		            });
    
    // add the shape to the layer
    this.layer.add(circle);
    
    // add the layer to the stage
    //stage.add(layer);
    super.add(this.layer);
    
    super.add(this.layer_TOP_LEFT);
    super.add(this.layer_TOP_RIGHT);
    super.add(this.layer_BOTTOM_LEFT);
    super.add(this.layer_BOTTOM_RIGHT);
    
    // draw the image
    this.layer.draw();
    this.layer_TOP_LEFT.draw();
    this.layer_TOP_RIGHT.draw();
    this.layer_BOTTOM_LEFT.draw();
    this.layer_BOTTOM_RIGHT.draw();
    //----------------------------------- Konva TEST END
  }

  setlayer() {
    let lists = this.data.shapes.getData();
    for (  var i = 0;  i < lists.length;  i++  ) {
        // console.log(lists[i]);
        if (lists[i].type == "shape") {
           add_layerd_Shape.call(this, lists[i]) ; 
         } else if (lists[i].type == "line") {
           add_layerd_Line.call(this, lists[i]) ; 
         }
    }
  }

  render() {
    // resize canvas
    const { data } = this;
    const { rows, cols } = data;
    // fixed width of header
    const fw = cols.indexWidth;
    // fixed height of header
    const fh = rows.height;

    this.draw.resize(data.viewWidth(), data.viewHeight());

    this.clear();
    //this.layer.clear();

    const viewRange = data.viewRange();
    // renderAll.call(this, viewRange, data.scroll);
    const tx = data.freezeTotalWidth();
    const ty = data.freezeTotalHeight();
    const { x, y } = data.scroll;


    // 1  BOTTOM-RIGHT
    renderContentGrid.call(this, viewRange, fw, fh, tx, ty);
    renderContent.call(this, viewRange, fw, fh, -x, -y);
    renderFixedHeaders.call(this, 'all', viewRange, fw, fh, tx, ty);
    renderFixedLeftTopCell.call(this, fw, fh);
    layer_render.call(this, this.layer_BOTTOM_RIGHT,this.layer_cell_BOTTOM_RIGHT,viewRange,fw, fh, -x, -y);  //GUSA

    const [fri, fci] = data.freeze;
    if (fri > 0 || fci > 0) {
      // 2
      if (fri > 0) {  // TOP-RIGHT
        const vr = viewRange.clone();
        vr.sri = 0;
        vr.eri = fri - 1;
        vr.h = ty;
        renderContentGrid.call(this, vr, fw, fh, tx, 0);
        renderContent.call(this, vr, fw, fh, -x, 0);
        renderFixedHeaders.call(this, 'top', vr, fw, fh, tx, 0);
        layer_render.call(this, this.layer_TOP_RIGHT,this.layer_cell_TOP_RIGHT,vr,fw, fh, -x, 0);  //GUSA

      }
      // 3
      if (fci > 0) {  //BOTTOM-LEFT
        const vr = viewRange.clone();
        vr.sci = 0;
        vr.eci = fci - 1;
        vr.w = tx;
        renderContentGrid.call(this, vr, fw, fh, 0, ty);
        renderFixedHeaders.call(this, 'left', vr, fw, fh, 0, ty);
        renderContent.call(this, vr, fw, fh, 0, -y);
        layer_render.call(this,this.layer_BOTTOM_LEFT,this.layer_cell_BOTTOM_LEFT,vr,fw, fh, 0, -y);  //GUSA
        
      }
      // 4  TOP-LEFT
      const freezeViewRange = data.freezeViewRange();
      renderContentGrid.call(this, freezeViewRange, fw, fh, 0, 0);
      renderFixedHeaders.call(this, 'all', freezeViewRange, fw, fh, 0, 0);
      renderContent.call(this, freezeViewRange, fw, fh, 0, 0);
      // 5
      renderFreezeHighlightLine.call(this, fw, fh, tx, ty);
      layer_render.call(this, this.layer_TOP_LEFT,this.layer_cell_TOP_LEFT,freezeViewRange,fw, fh, 0, 0);  //GUSA

    }

    //konva test
    this.layer.draw();
    this.layer_TOP_LEFT.draw();
    this.layer_TOP_RIGHT.draw();
    this.layer_BOTTOM_LEFT.draw();
    this.layer_BOTTOM_RIGHT.draw();

  }

  clear() {
    this.draw.clear();
    //this.layer.clear();
  }
}

export default Table;
