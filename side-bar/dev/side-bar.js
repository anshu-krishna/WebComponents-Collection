if (typeof customElements.get('side-bar') === 'undefined') {
	const __template__ = document.createElement('template');

	const __template_file__ = String(new URL(import.meta.url + '/../' + 'side-bar' + '.html'));
	__template__.innerHTML = await fetch(__template_file__).then(html => html.text().catch(e => 'Unable to load: ' + __template_file__));

	class SideBar extends HTMLElement {
		static #click_event_handler(e) {
			e.preventDefault();
			e.stopPropagation();
			this.open = false;
		}
		#nodes = {};
		#bound_click_event_handler;
		#not_init = true;

		constructor() {
			super();
			this.#nodes.root = this.attachShadow({ mode: 'closed' });
			this.#nodes.root.appendChild(__template__.content.cloneNode(true));
			this.#nodes.close = this.#nodes.root.querySelector('#close');
			this.#nodes.overlay = this.#nodes.root.querySelector('#overlay');

			this.#bound_click_event_handler = SideBar.#click_event_handler.bind(this);
			this.#nodes.close.addEventListener('click', this.#bound_click_event_handler);
			this.#nodes.overlay.addEventListener('click', this.#bound_click_event_handler);
		}
		get open() { return this.hasAttribute('open'); }
		set open(val) {
			if(val) { this.setAttribute('open', ''); }
			else { this.removeAttribute('open'); }
		}
		show() { this.open = true; }
		hide() { this.open = false; }
		// connectedCallback() {}
		// disconnectedCallback() {}
		// adoptedCallback() {}

		static get observedAttributes() {
			return ['open', 'disable-overlay-close'];
		}
		attributeChangedCallback(attrName, oldVal, newVal) {
			if(oldVal === newVal) { return; }
			// console.log('Attr:', attrName, '; From:', oldVal, '; To:', newVal, '; In:', this);
			switch(attrName) {
				case 'open':
					if(newVal === null) {
						if(this.#not_init) {
							this.#nodes.root.appendChild(document.createElement('style')).innerHTML = `:host(:not([open])) { animation: slide-out var(--delay) forwards; }`;
							this.#not_init = false;
						}
						this.dispatchEvent(new Event('close'));
						this.dispatchEvent(new Event('toggle'));
					} else {
						this.dispatchEvent(new Event('open'));
						this.dispatchEvent(new Event('toggle'));
					}
					break;
				case 'disable-overlay-close':
					if(newVal === null) {
						this.#nodes.overlay.addEventListener('click', this.#bound_click_event_handler);
					} else {
						this.#nodes.overlay.removeEventListener('click', this.#bound_click_event_handler);
					}
					break
			}
		}
	}

	customElements.define('side-bar', SideBar);
}