import { RaoulActor } from "./actor.mjs";
//import { BoilerplateItem } from "./documents/item.mjs";
// Import feuilles 
import { RaoulActorSheet } from "./raoul-actor-sheet.mjs";
import { RaoulItemSheet } from "./raoul-item-sheet.mjs";
CONFIG.Actor.documentClass = RaoulActor;
Hooks.once("init", ()=>{

    globalThis.raoul = game.Raoul = Object.assign(game.system, globalThis.raoul);
Actors.unregisterSheet("core", ActorSheet);
Actors.registerSheet("raoul", RaoulActorSheet, { makeDefault: true });
Items.unregisterSheet("core", ItemSheet);
Items.registerSheet("raoul", RaoulItemSheet, { makeDefault: true });
})