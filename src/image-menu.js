'use strict';
const {FuzzySuggestModal, getLanguage, Menu, Modal} = require('obsidian');
const {isImageFile} = require('./targets.js');

function label(ko, en) { return getLanguage() === 'ko' ? ko : en; }

class ImageFiles extends FuzzySuggestModal {
  constructor(app, choose) {
    super(app);
    this.choose = choose;
    this.setPlaceholder(label('Search for a replacement image...', 'Find a replacement image'));
  }
  getItems() { return this.app.vault.getFiles().filter(isImageFile); }
  getItemText(file) { return file.path; }
  onChooseItem(file) { this.choose(file); }
  onClose() { super.onClose(); this.afterClose?.(); }
}

class RenameImage extends Modal {
  constructor(app, file) { super(app); this.file = file; }
  onOpen() {
    this.setTitle(label('Rename', 'Rename'));
    const form = this.contentEl.createEl('form');
    const input = form.createEl('input', {type:'text'});
    input.value = this.file.basename;
    input.required = true;
    input.setAttribute('aria-label', label('File name', 'File name'));
    const error = form.createDiv({attr:{role:'alert'}});
    const buttons = form.createDiv('modal-button-container');
    buttons.createEl('button', {type:'button', text:label('Cancel', 'Cancel')}).onclick = () => this.close();
    const submit = buttons.createEl('button', {type:'submit', cls:'mod-cta', text:label('Rename', 'Rename')});
    form.onsubmit = async event => {
      event.preventDefault();
      if (submit.disabled) return;
      const name = input.value.trim();
      if (!name || /[\\/]/.test(name)) {
        error.setText(label('Please enter a file name.', 'Enter a file name without a folder path.'));
        return;
      }
      submit.disabled = true;
      try {
        const old = this.file.path;
        if (this.app.vault.getAbstractFileByPath(old) !== this.file) throw Error(label('File not found.', 'File no longer exists.'));
        if (name !== this.file.basename) {
          const path = old.slice(0, -this.file.name.length) + name + '.' + this.file.extension;
          const existing = this.app.vault.getAbstractFileByPath(path);
          if (existing && existing !== this.file) throw Error(label('A file with the same name already exists.', 'A file with that name already exists.'));
          await this.app.fileManager.renameFile(this.file, path);
        }
        this.close();
      } catch (err) { error.setText(err.message); submit.disabled = false; }
    };
    input.focus(); input.select();
  }
  onClose() { this.contentEl.empty(); this.afterClose?.(); }
}

async function imagePng(vault, file, win) {
  const bytes = await vault.readBinary(file);
  if (file.extension.toLowerCase() === 'png') return new win.Blob([bytes], {type:'image/png'});
  const type = file.extension.toLowerCase() === 'svg' ? 'image/svg+xml' : '';
  const url = win.URL.createObjectURL(new win.Blob([bytes], {type}));
  try {
    const img = new win.Image();
    img.src = url;
    await img.decode();
    const canvas = win.document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) :
      reject(Error(label('Unable to copy image.', 'Could not copy the image.'))), 'image/png'));
  } finally { win.URL.revokeObjectURL(url); }
}

function readingMenu(plugin, ref, win) {
  const {app, targets} = plugin, {imageFile, view} = ref;
  const menu = new Menu().setParentElement(view.contentEl);
  const add = (section, title, icon, action, disabled = false) => menu.addItem(item =>
    item.setSection(section).setTitle(title).setIcon(icon).setDisabled(disabled).onClick(() => plugin.perform(action)));
  add('image', label('Copy image', 'Copy image'), 'copy', () =>
    win.navigator.clipboard.write([new win.ClipboardItem({'image/png':imagePng(app.vault, imageFile, win)})]));
  add('image', label('Replace file...', 'Swap file...'), 'replace', () =>
    plugin.open(new ImageFiles(app, file => plugin.perform(() => targets.replaceImage(ref, file)))));
  add('image', label('Remove from note', 'Remove image'), 'image-minus', () => targets.removeFromNote(ref));
  add('image', label('Reset size', 'Reset size'), 'rotate-ccw', () => plugin.save(ref, {width:null}), ref.snapshot.spec.width === null);
  add('open', label('Open in new tab', 'Open in new tab'), 'file-plus', () => app.workspace.getLeaf('tab').openFile(imageFile));
  add('open', label('Open to the right', 'Open to the right'), 'separator-vertical', () => app.workspace.getLeaf('split', 'vertical').openFile(imageFile));
  add('action', label('Rename', 'Rename'), 'pencil', () => plugin.open(new RenameImage(app, imageFile)));
  // Core and community plugins supply the other file actions for this vault.
  app.workspace.trigger('file-menu', menu, imageFile, 'link-context-menu');
  menu.addItem(item => item.setSection('danger').setTitle(label('Delete image', 'Delete image'))
    .setWarning(true).setIcon('trash-2').onClick(() => plugin.perform(() => targets.deleteImage(ref))));
  return menu;
}
module.exports = {readingMenu};
