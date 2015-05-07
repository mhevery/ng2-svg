/// <reference path="typings/angular2/angular2.d.ts" />
import {
    Parent,
    Directive,
    Component,
    Query, QueryList,
    View, ViewRef, ViewContainerRef, ProtoViewRef,
    bootstrap, forwardRef, ElementRef,
    onAllChangesDone} from 'angular2/angular2';




@Component({
  selector: 'axis'
})
@View({
  directives: [forwardRef(() => SrcAxisTemplate)],
  template: `
  <svg>
    <rect *src-axis-template="var width=width; var y=y;"
          [attr.width]="width" height="5"
          x="0" [attr.y]="y + 5"
          style="fill:rgb(255,0,9);stroke-width:3;stroke:rgb(0,0,0)" />
  </svg>`
})
class Axis {
  srcAxisTemplate: SrcAxisTemplate;
  constructor() {
    console.log('Axis');
  }

  addTemplate(srcAxisTemplate: SrcAxisTemplate) {
    this.srcAxisTemplate = srcAxisTemplate;
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
    <g [dst-axes]="axes"></g>
  </svg>
  <!-- not necessary, but usefull for debugging -->
  <content></content>`,
  directives: [forwardRef(() => DstAxis)]
})
class Graph {
  width: number;
  height: number;
  dstAxis: DstAxis;
  axes: QueryList;

  constructor(@Query(Axis) axes: QueryList) {
    console.log('Graph');
    this.axes = axes;
  }
}




@Directive({
  selector: '[dst-axes]',
  properties: { 'dstAxesChanges': 'dstAxes | iterableDiff' }
})
class DstAxis {
  dstAxes: Array<Axis>;
  protoView: ProtoViewRef;
  // constructor(@Inject(() => Graph) graph, @Inject(ViewContainerRef) viewContainer) {
  constructor(public graph: Graph, public viewContainer: ViewContainerRef) {
    console.log('DstAaxis');
    this.graph.dstAxis = this;
  }

  set dstAxesChanges(changes) {
    console.log("DstAxis.dstAxisChanges", changes);
    changes.forEachAddedItem(changeRecord => {
      var axis: Axis = changeRecord.item;
      var viewRef:ViewRef = this.viewContainer.create(axis.srcAxisTemplate.protoView, -1, axis.srcAxisTemplate.elementRef);
      viewRef.setLocal('width', 1*this.graph.width);
      viewRef.setLocal('y', 1*this.graph.height);
    });
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

