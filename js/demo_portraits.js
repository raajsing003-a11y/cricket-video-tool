// demo portraits (sirf demo/test ke liye) — CORE.demoPortrait(jerseyColor,capColor,number)->canvas 800x1000
(function(){const C=window.CORE;
C.demoPortrait=function(c1,c2,num){const c=document.createElement('canvas');c.width=800;c.height=1000;const x=c.getContext('2d');
 let g=x.createRadialGradient(400,380,60,400,500,720);g.addColorStop(0,c1);g.addColorStop(1,'#050810');x.fillStyle=g;x.fillRect(0,0,800,1000);
 g=x.createLinearGradient(0,0,0,1000);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(300,0);x.lineTo(500,0);x.lineTo(780,1000);x.lineTo(20,1000);x.closePath();x.fill();
 g=x.createLinearGradient(0,620,0,1000);g.addColorStop(0,c2);g.addColorStop(1,'#0b1020');x.fillStyle=g;
 x.beginPath();x.moveTo(40,1000);x.bezierCurveTo(60,760,230,700,320,670);x.lineTo(480,670);x.bezierCurveTo(570,700,740,760,760,1000);x.closePath();x.fill();
 x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=6;x.stroke();
 x.fillStyle='rgba(255,255,255,.9)';x.font='bold 150px sans-serif';x.textAlign='center';x.fillText(num,400,930);
 x.fillStyle='#b9825a';x.fillRect(350,560,100,140);
 g=x.createRadialGradient(370,430,20,400,460,150);g.addColorStop(0,'#e0aa7e');g.addColorStop(1,'#a8724c');x.fillStyle=g;x.beginPath();x.ellipse(400,450,112,140,0,0,7);x.fill();
 x.fillStyle=c2;x.beginPath();x.ellipse(400,370,118,86,0,Math.PI,0);x.fill();x.fillRect(282,368,236,22);
 x.fillStyle='rgba(0,0,0,.25)';x.fillRect(282,386,236,8);
 x.strokeStyle='rgba(255,230,180,.55)';x.lineWidth=5;x.beginPath();x.ellipse(400,450,112,140,0,-1.2,.4);x.stroke();
 g=x.createLinearGradient(0,700,0,1000);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=g;x.fillRect(0,700,800,300);
 return c;};
})();
