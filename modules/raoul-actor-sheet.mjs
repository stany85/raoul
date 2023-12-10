export class RaoulActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["raoul", "sheet", "actor"],
      template: "systems/raoul/templates/raoul-joueur-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'joueur') {
      this._prepareItems(context);
     // this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'pnj') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
   // context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */



  _prepareItems(context) {
    // Initialize containers.
    const Baraka= [];
    const Metier = [];
    const Modedevie = [];
    const Origine = [];
    const Passetemps = [];
    const Objet = [];
    

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'objet') {
        Objet.push(i);
      }
      // Append to features.
      else if (i.type === 'baraka') {
        Baraka.push(i);
      }
      // Append to spells.
      else if (i.type === 'modedevie') {
        Modedevie.push(i);
      }
      // Append to spells.
      else if (i.type === 'origine') {
        Origine.push(i);
      }
      // Append to spells.
      else if (i.type === 'metier') {
        Metier.push(i);
      }
      else if (i.type === 'passetemps') {
        Passetemps.push(i);
      }
    }

    // Assign and return
    context.Baraka = Baraka;
    context.Objet = Objet;
    context.Passetemps = Passetemps;
    context.Modedevie = Modedevie;
    context.Origine = Origine;
    context.Metier = Metier;

  }


  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.jetdedes').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  
   // Jet de dés moelle, gras ou culot

   _onRoll(event){
    console.log(event);
    const minimumRequis = event.target.dataset["dice"];
    const valrequis = event.target.dataset["dice"]-1;
    const caracteristique = event.target.dataset["caract"];
    const texte ="Jet de " + caracteristique + ", dés supérieurs ou égaux  à "+minimumRequis+" :";

    
    var formula = "3d6cs>"+valrequis;
    let r= new Roll(formula);
    console.log(r.terms);
    r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor}),
      flavor : texte
    });
    //return r;
  }



}
