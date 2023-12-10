export default class RaoulActorSheet extends ActorSheet{

    get template(){
        console.log(`Raoul : récupération ${this.actor.data.type}-sheet.html`);
        return `systems/raoul/templates/${this.actor.data.type}-sheet.html`;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["raoul", "sheet", "actor"],
          template: "systems/raoul/templates/raoul-sheet.html",
          width: 450,
          height: 600,
          tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
          scrollY: [".biography", ".items", ".attributes"],
          dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
      }
    get template() {
        let type = this.actor.type;
        return `systems/raoul/templates/${type}-sheet.html`;
    }

    get actorData() {
        return this.actor.system;
    }

    get actorProperties() {
        return this.actorData.system;
    }

    getData(){
      const sheetData = super.getData();
      sheetData.system = sheetData.data.system;
      console.log(sheetData);
      migrateFocus(this.actor);
      const character = sheetData.actor;


        character.objet = actorData.items.filter(item => item.type === "objet");
        character.baraka = actorData.items.filter(item => item.type === "baraka");
        character.origine = actorData.items.filter(item => item.type === "origine");
        character.metier = actorData.items.filter(item => item.type === "metier");
        character.modedevie = actorData.items.filter(item => item.type === "modedevie");
        character.passetemps = actorData.items.filter(item => item.type === "passetemps");
        return actorData;
    }


    activateListeners(html){
      super.activateListeners(html);

      html.find('.jetdedes').click(this._onRoll.bind(this));
      html.find('.item-edit').click(this._onItemEdit.bind(this));
      html.find('.item-delete').click(this._onItemDelete.bind(this));
      }

      getItemFromEvent = (ev) =>{
        const parent = $(ev.currentTarget).parents(".item");
        return this.actor.getOwnedItem(parent.data("itemId")); 

      }
      _onItemEdit(event){
        const item = this.getItemFromEvent(event);
        item.sheet.render(true); 
      }
      _onItemDelete(event){
        const item = this.getItemFromEvent(event);
        
        let d = Dialog.confirm({
          title: "suppression d'objet",
          content: "<p>Confirmer suppression de '"+ item.name +"' ?</p>",
          yes:() => this.actor.deleteOwnedItem(item._id),
          no: () => { },
          defaultYes: false
        });

        
      }



      _onRoll(event){
        console.log(event);
        const minimumRequis = event.target.dataset["dice"]-1;
        const caracteristique = event.target.dataset["caract"];
        const texte ="Jet de " + caracteristique;

        let roll = new Roll("3d6");
        var formula = roll.formula+ "cs>"+minimumRequis;
        roll= new Roll(formula);
        roll.roll().toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor}),
          flavor : texte
        });
      }
}