/*! 2024-03-19 */
Ufo.define(function(){return{calcSize:function(n,t){var u,e,i=/(\d*(\.\d+)?)([^\d]+)$/,n=null!=n?n+"":n,t=null!=t?t+"":t,r=n&&n.match(i),i=t&&t.match(i);return r&&(n=r[1],u=r[3]),i&&(t=i[1],e=i[3]),u=u||"px",e=e||"px",{width:n=n&&Number(n),height:t=t&&Number(t),wunit:u,hunit:e}}}});