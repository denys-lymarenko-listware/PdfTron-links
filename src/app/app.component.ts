import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { BundlePdfTronBuilderService } from './bundle-pdf-tron-builder.service';

declare const WebViewer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  wvInstance: any;

  constructor(
    private bundlePdfTronBuilderService: BundlePdfTronBuilderService
  ) {}

  ngOnInit() {
  }

  generate(): void {
    this.insertBundleCover();
  }

  async ngAfterViewInit() {


    console.log('init', this.viewer, WebViewer);

    WebViewer({
      path: '../lib',
      initialDoc: '../files/webviewer-demo-annotated.pdf'
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;


      console.log('instance');

      instance.docViewer.on('documentLoaded', () => {
        console.log('documentLoaded');

        this.generate();
      });
    });
  }

  private async insertBundleCover(): Promise<void> {
    const newDoc: CoreControls.Document = await this.wvInstance.CoreControls.createDocument(
      this.bundlePdfTronBuilderService.generateCover().output('blob'),
      { extension: 'pdf' }
    );

    console.log('Inser Index page');

    await this.wvInstance.docViewer.getDocument().insertPages(newDoc, [1], 1);
  }
}
