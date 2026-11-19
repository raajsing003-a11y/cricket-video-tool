// C171: text_fx — har bade text par kala border (outline) + peeche halka kala shadow, aur text frame se bahar na jaye.
// Band karna ho: CORE.TEXTFX=false (console mein) ya is file ki script line hata do.
// - Outline/shadow: sirf halke rang ke text par (gehre rang ka text, jaise peele circle ke andar number, jaisa tha waisa).
// - Frame se bahar: sirf center-aligned text (title/shabd/headline) apne aap thoda sikud jata hai (SAFE margin). Scrolling ticker (left-aligned) ko nahi chhuta.
(function(){const C=window.CORE;if(!C||!window.CanvasRenderingContext2D)return;
C.TEXTFX=true;C.TEXTFX_MINPX=38;C.TEXTFX_SAFE=44;
const proto=CanvasRenderingContext2D.prototype,_fill=proto.fillText;
function lum(s){
  if(typeof s!=='string')return 1;
  let m=/^#([0-9a-f]{3})$/i.exec(s),r,g,b;
  if(m){r=parseInt(m[1][0]+m[1][0],16);g=parseInt(m[1][1]+m[1][1],16);b=parseInt(m[1][2]+m[1][2],16);}
  else if((m=/^#([0-9a-f]{6})/i.exec(s))){r=parseInt(m[1].slice(0,2),16);g=parseInt(m[1].slice(2,4),16);b=parseInt(m[1].slice(4,6),16);}
  else if((m=/^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(s))){r=+m[1];g=+m[2];b=+m[3];}
  else return 1;
  return (0.299*r+0.587*g+0.114*b)/255;
}
proto.fillText=function(txt,x,y,mw){
  if(C.TEXTFX===false||txt==null||txt==='')return _fill.apply(this,arguments);
  try{
    const fm=/(\d+(?:\.\d+)?)px/.exec(this.font),px=fm?+fm[1]:0;
    if(!px)return _fill.apply(this,arguments);
    const m=this.getTransform(),sc=Math.hypot(m.a,m.b)||1,pxe=px*sc;
    if(pxe<C.TEXTFX_MINPX)return _fill.apply(this,arguments);
    const s=String(txt);
    // 1) frame ke andar rakho (center-aligned)
    if(mw==null&&this.textAlign==='center'&&sc>.01&&Math.abs(m.b)<.35*sc&&Math.abs(m.c)<.35*sc){
      const cw=this.canvas.width,gx=m.a*x+m.c*y+m.e,avail=2*Math.min(gx-C.TEXTFX_SAFE,cw-C.TEXTFX_SAFE-gx)/sc-px*.12,w=this.measureText(s).width;
      if(avail>60&&w>avail)mw=avail;
    }
    // 2) kala border + shadow (sirf halke rang ke text par)
    if(lum(this.fillStyle)>.3&&this.globalAlpha>.02){
      this.save();
      this.shadowColor='rgba(0,0,0,.78)';this.shadowBlur=Math.max(6,pxe*.12);this.shadowOffsetX=0;this.shadowOffsetY=Math.max(3,pxe*.05);
      this.strokeStyle='#000';this.lineJoin='round';this.miterLimit=2;this.lineWidth=Math.max(3,Math.min(18,px*.13));
      if(mw!=null)this.strokeText(s,x,y,mw);else this.strokeText(s,x,y);
      this.restore();
    }
    return mw!=null?_fill.call(this,txt,x,y,mw):_fill.call(this,txt,x,y);
  }catch(e){return _fill.apply(this,arguments);}
};
})();
