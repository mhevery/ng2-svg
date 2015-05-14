/// <reference path="typings/angular2/angular2.d.ts" />
import {
    Parent,
    Directive,
    Component,
    NgFor,
    Query, QueryList,
    View, ViewRef, ViewContainerRef, ProtoViewRef,
    bootstrap, forwardRef, ElementRef,
    onChange} from 'angular2/angular2';


@Directive({
  selector: '[ng-template-ref]'
  property: {'ngTemplateRef', 'ngTemplateRef'}
})
class NgTemplateRef {
  ngTemplateRef: any;

  constructor(public protoView: ProtoViewRef, public elementRef: ElementRef) {
    console.log('NgTemplateRef');
  }
}





@Directive({
  selector: '[ng-outlet]',
  properties: {
    'ngOutlet': 'ngOutlet',
    'ngOutletLocals': 'ngOutletLocals'
  },
  lifecycle: [onChange]
})
class NgOutlet {
  ngOutletLocals:any;
  ngOutlet:NgTemplateRef;

  constructor(public viewContainer: ViewContainerRef) {
    console.log('NgOutlet');
  }

  onChange() {
    console.log("NgOutlet.ngTemplateRef", this.ngTemplateRef, this.ngOutletLocals);
    // todo: Don't destroy the view if ngTemplateRef did not change
    this.viewContainer.clear();
    var viewRef:ViewRef = this.viewContainer.create(ngTemplateRef.protoView, -1, ngTemplateRef.elementRef);
    for(var prop in this.ngOutletLocals) {
      viewRef.setLocal(prop, this.ngOutletLocals[prop]);
    }
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'axis'
})
@View({
  directives: [NgTemplateRef],
  template: `
  <svg>
    <rect *ng-template-ref
          width="100%" height="5" x="0" y="0"
          style="fill:rgb(255,0,9);stroke-width:3;stroke:rgb(0,0,0)" />
  </svg>`
})
class Axis {
  ngTemplateRefs: QueryList<NgTemplateRef>;
  constructor(@ViewQuery(NgTemplateRef) ngTemplateRefs:QueryList<NgTemplateRef>) {
    console.log('Axis');
    this.ngTemplateRefs = ngTemplateRefs;
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
        <template *ng-outlet="axis.ngTemplateRefs.first; locals: {}"></template>
      </g>
    </svg>
  </svg>
  <!-- not necessary, but useful for debugging -->
  <content></content>`,
  directives: [NgOutlet, NgFor]
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

