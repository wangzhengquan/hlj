/*! 2024-03-19 */
KISSY.add(function(e,o){return{getMonthName:function(e,t){return(!0===t?["&#74;&#97;&#110;","&#70;&#101;&#98;","&#77;&#97;&#114;","&#65;&#112;&#114;","&#77;&#97;&#121;","&#74;&#117;&#110;","&#74;&#117;&#108;","&#65;&#117;&#103;","&#83;&#101;&#112;","&#79;&#99;&#116;","&#78;&#111;&#118;","&#68;&#101;&#99;"]:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])[e.getMonth()]},getWeekName:function(e,t){return(!0===t?["&#83;&#117;&#110;","&#77;&#111;&#110;","&#84;&#117;&#101;","&#87;&#101;&#100;","&#84;&#104;&#117;&#114;","&#70;&#114;&#105;","&#83;&#97;&#116;"]:["Sun","Mon","Tue","Wed","Thur","Fri","Sat"])[e.getDay()]},format:function(e,t){if(!e)return"";t=t||"yyyy-MM-dd mm:ss";var n,r,u,g={TZ:o.toSignedNumberString(parseInt(-e.getTimezoneOffset()/60)),"q+":Math.floor((e.getMonth()+3)/3),"y+":e.getFullYear(),MN:this.getMonthName(e,!0),"M+":e.getMonth()+1,"d+":e.getDate(),WN:this.getWeekName(e),"h+":e.getHours(),"H+":(n=e.getHours())<13?n:n-12,"m+":e.getMinutes(),MP:e.getMinutes()-(new Date).getMinutes(),"s+":e.getSeconds(),DP:e.getHours()<12?"AM":"PM"};for(r in g)new RegExp("("+r+")").test(t)&&(u=RegExp.$1,t=t.replace(u,function(){return"yy"===u?g[r]%100:1<u.length&&"number"==typeof g[r]&&-1<g[r]&&g[r]<10?"0"+g[r]:g[r]}));return t}}},{requires:["./Number"]});