import"./rolldown-runtime-CNC7AqOf.js";import{Dn as e,Tn as t,Un as n}from"./vendor-BB-zCLnP.js";n();var r=e(),i={elevated:`glass-elevated`,outlined:`bg-transparent border border-primary/20`,filled:`bg-surface-container border-0`,glass:`glass-panel`};function a({children:e,className:n=``,variant:a=`glass`,hoverable:o=!1,as:s=`div`,...c}){return(0,r.jsx)(o?t.div:s,{className:`
        rounded-xl
        ${i[a]||i.glass}
        ${o?`card-hover cursor-pointer`:``}
        ${n}
      `,...o?{whileHover:{y:-2},transition:{duration:.2}}:{},...c,children:e})}export{a as t};