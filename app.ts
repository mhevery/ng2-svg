/// <reference path="typings/angular2/angular2.d.ts" />
import {
    Parent,
    Directive,
    Component,
    NgFor,
    Query, QueryList,
    View, ViewRef, ViewContainerRef, ProtoViewRef,
    bootstrap, forwardRef, ElementRef,
    onAllChangesDone} from 'angular2/angular2';



@Directive({
  selector: '[view-dst]',
  properties: { 'viewDst': 'viewDst' }
})
class ViewDst {
  constructor(public viewContainer: ViewContainerRef) {
    console.log('ViewDst');
  }

  set viewDst(templateRef:SrcAxisTemplate) {
    console.log("ViewDst.templateRef", templateRef);
    var viewRef:ViewRef = this.viewContainer.create(templateRef.protoView, -1, templateRef.elementRef);
    // TODO: set locals
  }
}




@Component({
  selector: 'axis'
})
@View({
  directives: [forwardRef(() => SrcAxisTemplate)],
  template: `
  <svg>
    <rect *src-axis-template="var width=width; var y=y;"
          width="100%" height="5" x="0" y="0"
          style="fill:rgb(255,0,9);stroke-width:3;stroke:rgb(0,0,0)" />
  </svg>`
})
class Axis {
  templateRef: SrcAxisTemplate;
  constructor() {
    console.log('Axis');
  }

  addTemplate(srcAxisTemplate: SrcAxisTemplate) {
    this.templateRef = srcAxisTemplate;
  }
}



@Directive({
  selector: '[src-axis-template]'
})
class SrcAxisTemplate {
  constructor(axis: Axis, public protoView: ProtoViewRef, public elementRef: ElementRef) {
    console.log('SrcAxisTemplate');
    axis.addTemplate(this);
  }
}


@Component({
  selector: 'graph',
  properties: {
    width: 'width',
    height: 'height'
  }
})
@View({
  template: `
  <svg width="100%" height="100%">
    <rect [attr.width]="width" [attr.height]="height"
          style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
    <svg [attr.width]="width" height="10" x="0" [attr.y]="1*height + 5">
      <g *ng-for="var axis of axes; var i=$index" [attr.y]="i*10">
        <template [view-dst]="axis.templateRef"></template>
      </g>
    </svg>
  </svg>
  <!-- not necessary, but useful for debugging -->
  <content></content>`,
  directives: [ViewDst, NgFor]
})
class Graph {
  width: number;
  height: number;
  axes: QueryList;

  constructor(@Query(Axis) axes: QueryList) {
    console.log('Graph');
    this.axes = axes;
  }
}




// Annotation section
@Component({
  selector: 'my-app'
})
@View({
  directives: [Graph, Axis],
  template: `
  <graph width="500" height="300">
    <axis></axis>
  </graph>`
})
// Component controller
class MyAppComponent {
  constructor() {
    console.log('MyAppComponent');
  }
}

//console.log(ViewContainerRef);

bootstrap(MyAppComponent);

