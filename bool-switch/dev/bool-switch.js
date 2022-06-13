if (typeof customElements.get('bool-switch') === 'undefined') {
	const __template__ = document.createElement('template');

	const __template_file__ = String(new URL(import.meta.url + '/../bool-switch.html'));
	__template__.innerHTML = await fetch(__template_file__).then(html => html.text()).catch(e => 'Unable to load: ' + __template_file__);

	class BoolSwitch extends HTMLElement {
		#root;
		#internals;
		#ip;

		constructor() {
			super();
			this.#root = this.attachShadow({ mode: 'closed' });
			this.#root.appendChild(__template__.content.cloneNode(true));
			this.#ip = this.#root.querySelector('input');
			this.#internals = this.attachInternals();
			this.#internals.role = 'checkbox';

			this.addEventListener('click', (e) => {
				e.preventDefault();
				if(!this.hasAttribute('disabled')) {
					this.on = !this.hasAttribute('on');
				}
			});
			for(const p of Object.keys(ElementInternals.prototype).filter(v => v.startsWith('aria'))) {
				Object.defineProperty(this, p, { value: this.#internals[p] });
			}
		}
		connectedCallback() { this.#formUpdate(); }
		// disconnectedCallback() { }
		adoptedCallback() { this.#formUpdate(); }

		static get observedAttributes() { return ['on', 'required', 'disabled']; }
		attributeChangedCallback(attrName, oldVal, newVal) {
			if(oldVal === newVal) { return; }
			// console.log('Attr:', attrName, '; From:', oldVal, '; To:', newVal, '; In:', this);

			switch (attrName) {
				case 'on': {
					this.#formUpdate();
					this.dispatchEvent(new Event('change'));
				} break;
				case 'required': {
					this.#internals.ariaRequired = newVal !== null;
				} break;
				case 'disabled': {
					this.#internals.ariaDisabled = newVal !== null;
				} break;
			}
		}

		get on() { return this.hasAttribute('on'); }
		set on(value) {
			if (!!value) {
				this.setAttribute('on', '');
			} else {
				this.removeAttribute('on');
			}
		}
		get required() { return this.hasAttribute('required'); }
		set required(value) {
			if (!!value) {
				this.setAttribute('required', '');
			} else {
				this.removeAttribute('required');
			}
		}
		get disabled() { return this.hasAttribute('disabled'); }
		set disabled(value) {
			if (!!value) {
				this.setAttribute('disabled', '');
			} else {
				this.removeAttribute('disabled');
			}
		}

		#formUpdate() {
			const on = this.hasAttribute('on');
			this.#internals.setFormValue(on);
			this.#internals.ariaChecked = on;
			if (this.hasAttribute('required') && !on) {
				this.#internals.setValidity({ valueMissing: true }, 'Required: This must be ON', this.#ip);
				// this.#internals.setValidity({ valueMissing: true }, 'Required: This must be ON');
			} else {
				this.#internals.setValidity({});
			}
		}
		// static get focusable() { return true; }
		static get formAssociated() { return true; }
		get shadowRoot() { return this.#internals.shadowRoot; }
		get form() { return this.#internals.form; }
		get states() { return this.#internals.states; }
		get willValidate() { return this.#internals.willValidate; }
		get validity() { return this.#internals.validity; }
		get validationMessage() { return this.#internals.validationMessage; }
		get labels() { return this.#internals.labels; }

		setFormValue(...args) { return this.#internals.setFormValue(...args); }
		setValidity(...args) { return this.#internals.setValidity(...args); }
		checkValidity(...args) { return this.#internals.checkValidity(...args); }
		reportValidity(...args) { return this.#internals.reportValidity(...args); }

		get name() { return this.getAttribute('name'); }
		get type() { return this.localName; }
	}

	customElements.define('bool-switch', BoolSwitch);
}