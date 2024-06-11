const TEMPLATES=new class{#frag=new DocumentFragment;add(templateHTML){const container=document.createElement("div");container.innerHTML=templateHTML;this.#frag.appendChild(container.querySelector("template"))}clone(id,deep=true){return this.#frag.querySelector(id)?.content?.cloneNode?.(deep)??null}};TEMPLATES.add('<template id="link-group"> <style>*{box-sizing:border-box}:host{--heading-background:#121212;--heading-color:#fff;--border:#121212;--padding:0.7em 0.9em;--angle:0deg;--hover-background:linear-gradient(var(--angle),#0072 0%,#0078 100%);--active-background:linear-gradient(var(--angle),#0052 0%,#0058 100%);background:inherit;border:1px solid var(--border);border-radius:.4em;color:inherit;display:block}::slotted(:not(:where(a,link-group))){display:none}div,header{border-radius:inherit}header{background:var(--heading-background);color:var(--heading-color);display:grid;gap:2px;grid-template-columns:1fr -webkit-max-content;grid-template-columns:1fr max-content}header button{background:#0000;border:none;border-radius:inherit;color:inherit;cursor:pointer;font:inherit;padding:var(--padding);text-align:left}header button:hover{background:var(--hover-background)}header button:active{background:var(--active-background)}header>#heading{font-weight:700}header>button:last-of-type{border-left:1px solid var(--border);text-align:center}section{align-items:baseline;display:none;flex-wrap:wrap;gap:.5em;justify-content:center;padding:var(--padding)}::slotted(a){background:#0000;border:1px solid var(--border);border-radius:.4em;box-sizing:border-box;color:inherit;display:inline-block;padding:var(--padding);-webkit-text-decoration:none;text-decoration:none}::slotted(a:hover){background:var(--hover-background)}::slotted(a:active){background:var(--active-background)}:host([open]) section{display:flex}:host([open]) header{border-bottom:1px solid var(--border)}@media (prefers-color-scheme:light){:host{--heading-background:#ededea;--heading-color:#000;--border:#ededea;--hover-background:linear-gradient(var(--angle),#ddf2 0%,#ddf8 100%);--active-background:linear-gradient(var(--angle),#aaf2 0%,#aaf8 100%)}}</style> <div> <header><button id="heading" title="Toggle list"></button><button id="openall" title="Open all links">Open All</button></header> <section><slot></slot></section> </div> </template>');class LinkGroup extends HTMLElement{static{customElements.define("link-group",this)}#nodes={};constructor(){super();const root=this.attachShadow({mode:"closed"});root.appendChild(TEMPLATES.clone("#link-group"));root.querySelector("#openall").addEventListener("click",()=>{for(const a of this.anchors){a.click()}});this.#nodes.slot=root.querySelector("slot");this.#nodes.heading=root.querySelector("#heading");this.#nodes.heading.textContent=this.heading;this.#nodes.heading.addEventListener("click",()=>{this.open=!this.open})}*#extractAnchors(){for(const e of this.#nodes.slot.assignedElements()){if(e.matches("a")){yield e}else if(e.matches("link-group")){yield*e.anchors}}}get anchors(){return[...this.#extractAnchors()]}#processLinks(){for(const a of this.#nodes.slot.assignedElements()){a.setAttribute("target","_blank");a.setAttribute("rel","noopener noreferrer")}}connectedCallback(){this.#processLinks()}adoptedCallback(){this.#processLinks()}static get observedAttributes(){return["heading"]}attributeChangedCallback(attrName,oldVal,newVal){if(oldVal===newVal){return}switch(attrName){case"heading":this.#nodes.heading.textContent=this.heading;break}}get heading(){const h=(this.getAttribute("heading")??"").trim();return h.length===0?"Group":h}get open(){return this.hasAttribute("open")}set open(value){value??=false;if(value){this.setAttribute("open","")}else{this.removeAttribute("open")}}}