import Konva from 'konva';


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

//function makeShape(attr, shape_data, data, move_layerd_Shape) {
function makeShape(attr, shape_data, data, move_func) {
/*
 let {
    left, top, width, height,
   } = data.cellRect(pdata.rindex , pdata.cindex);
   
  //console.log(left, top, width, height)

  let left_pad = data.cols.indexWidth;
  let cell_address = stringAt(pdata.cindex) + String(pdata.rindex +1 );
*/
  var left = attr.left;
  var top  = attr.top;
  var width = attr.width;
  var height = attr.height;
  var left_pad = attr.left_pad;
  var cell_address = attr.cell_address;


  let shape1 = new Shape({
        x: left + left_pad,
        y: top,
        draggable: true,
        name: shape_data.name
      });

  let text = new Konva.Text({
        x: 10,
        y: 3,
        text: shape_data.name + " / " + cell_address,
        fontSize: 14,
        fontFamily: 'Calibri',
        fill: 'red'
      });

  let rect = new Konva.Rect({
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
              //move_layerd_Shape.call(table, name, shape, rindex, cindex);
              move_func.call(table, name, shape, rindex, cindex);

       });

   shape1.add(rect);
   shape1.add(text);
  return shape1;

}

export default {};
export {
  makeShape,
  Shape
};
