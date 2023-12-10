export default class RaoulItemSheet extends ItemSheet{

    get template(){
        console.log(`Raoul : récupération ${this.item.data.type}-sheet.html`);
        return `systems/raoul/templates/${this.item.data.type}-sheet.html`;
    }

    getData(){
        const data = super.getData();
        console.log(data);
        return data;
    }
}