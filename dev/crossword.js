let crosswordAll=[],gridAll=[];const gridSize=30,emptyCell="_";let grid=Array.from(Array(gridSize),()=>new Array(gridSize));function getJson(){fetch("/getthisgrid").then(e=>e.json()).then(e=>{gridAll=e}).catch(e=>console.error(e)),fetch("/getthisclues").then(e=>e.json()).then(e=>{crosswordAll=e}).catch(e=>console.error(e))}let slots=gridSize*gridSize,gridDiv=document.getElementById("grid"),row=0,column=0;for(let e=0;e<slots;e++){let e=document.createElement("DIV");e.id=row+"_"+column,e.classList.add("slot"),e.style.border="1px solid #e9e9e9",e.style.backgroundColor="#e9e9e9",gridDiv.appendChild(e),++column>=gridSize&&(column=0,row++)}function displayCrosswordPuzzle(){for(var e=0;e<gridAll.length;++e){var r,l=gridAll[e].x,t=gridAll[e].y,o=document.getElementById(l+"_"+t);"_"!=gridAll[e].symbol&&isNaN(gridAll[e].symbol)?((r=document.createElement("input")).type="text",r.className="inputLetter",r.id="i_"+l+"_"+t,r.maxLength=1,r.style.width=o.clientWidth+"px",r.style.height=o.clientHeight+"px",o.style.borderBottom="1px solid #9a8e9a",o.style.borderRight="1px solid #9a8e9a",o.style.backgroundColor="rgb(153, 204, 255)",o.style.fontSize="22px",o.appendChild(r)):isNaN(gridAll[e].symbol)?(o.innerHTML="",o.style.backgroundColor="#e9e9e9"):(o.innerHTML=gridAll[e].symbol,o.style.backgroundColor="#e9e9e9",o.style.fontSize="15px")}printClues()}function printClues(){var e=document.getElementById("questionsV"),r=document.getElementById("questionsH");e.innerHTML="",r.innerHTML="",e.innerHTML="<h3>vertical</h3>",r.innerHTML="<h3>horizontal</h3>";for(var l=0;l<crosswordAll.length;++l){var t=crosswordAll[l].id+". "+crosswordAll[l].clue;"h"==crosswordAll[l].dir?r.innerHTML+=t+"<br><br>":"v"==crosswordAll[l].dir&&(e.innerHTML+=t+"<br><br>")}}function checkCrossword(){let e=!0;for(var r,l,t,o=0;o<gridAll.length;++o)"_"!=gridAll[o].symbol&&isNaN(gridAll[o].symbol)&&(r=gridAll[o].x,l=gridAll[o].y,t=document.getElementById("i_"+r+"_"+l),r=document.getElementById(r+"_"+l),l=t.value,t=gridAll[o].symbol,l.toLowerCase()!=t)&&(e=!1,r.style.backgroundColor="#FF0000");if(1==e){var n=document.getElementsByClassName("slot");for(let e=0;e<n.length;e++)0<n[e].getElementsByClassName("inputLetter").length&&(n[e].style.backgroundColor="rgb(153, 255, 153)");alert("wooow congrats! al good ;)")}else 0==e?alert("naaah something wrong ;("):alert("unexpected error")}function getCurrentSlot(r,l){var e=gridAll.find(e=>e.x===r&&e.y===l);if(!e)return null;const{x:t,y:o}=e;return{current:e,right:gridAll.find(e=>e.x===t&&e.y===o+1),left:gridAll.find(e=>e.x===t&&e.y===o-1),down:gridAll.find(e=>e.x===t+1&&e.y===o),up:gridAll.find(e=>e.x===t-1&&e.y===o)}}function getCurrentCursorPosition(){var e=document.activeElement;if(null!=e){var[,e,r]=e.id.split("_");const l=parseInt(e,10),t=parseInt(r,10);return gridAll.find(e=>e.x===l&&e.y===t)?{x:l,y:t}:null}}getJson(),document.addEventListener("keydown",function(e){var{x:r,y:l}=getCurrentCursorPosition(),{right:r,left:l,down:t,up:o}=getCurrentSlot(r,l);let n;if("ArrowRight"===e.key&&r)n=r;else if("ArrowLeft"===e.key&&l)n=l;else if("ArrowDown"===e.key&&t)n=t;else{if("ArrowUp"!==e.key||!o)return;n=o}r=document.getElementById("i_"+n.x+"_"+n.y);r&&(r.focus(),r.select()),e.preventDefault()});