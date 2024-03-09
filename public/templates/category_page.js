import { bottomSheetTemplate } from '../templates/bottom_sheet.js';
export const categeoryTemplate = document.createElement('template');
export const customCategeoryTemplate = document.createElement('template');

customCategeoryTemplate.innerHTML = `
<h1 id="custom-categories">custom categories</h1>
`;

categeoryTemplate.innerHTML = bottomSheetTemplate.innerHTML;
