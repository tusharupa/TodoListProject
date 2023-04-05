import { initializeTaskEvents ,listenTaskClicks} from "./taskHandler";
import { initializeProjectEvents,listenProjectClicks} from "./projectHandler";
import {domEventListeners} from "./dom";


initializeTaskEvents();
initializeProjectEvents();
listenProjectClicks();
listenTaskClicks();
domEventListeners();