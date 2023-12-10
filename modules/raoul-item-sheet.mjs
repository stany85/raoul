export class RaoulItemSheet extends ItemSheet{
    
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ["raoul", "sheet", "item"],
        template: "systems/raoul/templates/objet-sheet.hbs",
        width: 480,
        height: 600,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
      });
    }
    get template() {
      const path = "systems/raoul/templates/";
      // Return a single sheet for all item types.
      // return `${path}/item-sheet.html`;
  
      // Alternatively, you could use the following return statement to do a
      // unique item sheet by type, like `weapon-sheet.html`.
      return `${path}/${this.item.type}-sheet.hbs`;
    }
  
}