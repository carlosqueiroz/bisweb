const $ = require('jquery');
const bis_webutil = require('bis_webutil.js');
const bis_webfileutil = require('bis_webfileutil.js');
const bis_genericio = require('bis_genericio.js');
const bis_bidsutils = require('bis_bidsutils.js');
const BisWebPanel = require('bisweb_panel.js');

class DicomImportElement extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        
        let viewerid = this.getAttribute('bis-viewerid');
        let viewerid2 = this.getAttribute('bis-viewerid2');
        let layoutid = this.getAttribute('bis-layoutwidgetid');
        let filetreepanelid = this.getAttribute('bis-filetreepanelid');

        this.viewers = [
            document.querySelector(viewerid),
            document.querySelector(viewerid2)
        ];

        
        this.layoutcontroller=document.querySelector(layoutid);
        let panel=new BisWebPanel(this.layoutcontroller,
                                  { name : "DICOM Import",
                                    permanent : true,
                                  });
        panel.show();

        this.parentDomElement=panel.getWidget();
        let basediv=$('<div></div>');
        this.parentDomElement.append(basediv);

        this.filetreepanel = document.querySelector(filetreepanelid);

        bis_webutil.createbutton({
            type: 'info',
            name: 'Open File Tree Panel',
            tooltip: 'Opens a panel which can display DICOM studies.',
            parent: basediv,
            css: { 'width': '90%', 'margin': '3px' },
            callback: () => {
                this.filetreepanel.showTreePanel();
            },
        });

        bis_webfileutil.createFileButton({ type : 'danger',
            name : 'Import Images from DICOM Study',
            parent : basediv,
            css : { 'width' : '90%' , 'margin' : '3px' },
            callback : (f) => {
                this.importDicomStudy(f);
            },
        },{
            title: 'Directory to import study from',
            filters:  'DIRECTORY',
            suffix:  'DIRECTORY',
            save : false,
        });
    }

    async importDicomStudy(inputDirectory) {
        let outputDirectory = null;

        if (!bis_webfileutil.candoComplexIO()) {
            console.log('Error: cannot import DICOM study without access to file server.');
            return;
        }

        if (!bis_genericio.isDirectory(inputDirectory)) {
            inputDirectory = bis_genericio.getDirectoryName(bis_genericio.getNormalizedFilename(inputDirectory));
        }

        let outputFileCallback = (f) => {
            outputDirectory = f;
            bis_genericio.runFileConversion({ 
                'fileType' : 'dicom',
                'inputDirectory' : inputDirectory
            }).then( (fileConversionOutput) => {
                console.log('Conversion done, now converting files to BIDS format.');
                bis_bidsutils.dicom2BIDS({ 'indir' : fileConversionOutput.output, 'outdir' : outputDirectory }).then( (obj) => {
                    console.log('obj', obj);
                });
            }).catch( (e) => {
                console.log('An error occured during file conversion', e);
            });
        };

        setTimeout( () => {
            bis_webfileutil.genericFileCallback({
                filters : "DIRECTORY",
                suffix : "DIRECTORY",
                title : "Select an output directory for the conversion",
                save : false,
            }, outputFileCallback);
        });

    }
}

bis_webutil.defineElement('bisweb-dicomimportelement', DicomImportElement);