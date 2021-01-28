import * as vscode from 'vscode';
import AdmZip = require('adm-zip');
import { arch, tmpdir } from 'os';
import * as path from 'path';

function Deploy(root: string | undefined) {
    var zip = new AdmZip();
    if (root) {
        zip.addLocalFolder(path.join(root, 'src'));
    }
    let archive = path.join(tmpdir(), 'sample.zip');
    console.log(archive);
    zip.writeZip(archive);

    vscode.window.showInformationMessage(`hello ${root}`);
}

export default Deploy;
