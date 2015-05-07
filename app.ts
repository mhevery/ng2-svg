/// <reference path="typings/angular2/angular2.d.ts" />
import {Parent, Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'graph',
  properties: {
    width: 'width',
    height: 'height'
  }
})
@View({
  template: `
  <svg>
    <rect [attr.width]="width" [attr.height]="height" 
          style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
  </svg>
  <!-- not necessary, but usefull for debugging -->
  <content></content>
  `
})
class Graph {
  width: number;
  heigh: number; 
  
  addAxis(axis: Axis) {
    
  }
}

@Component({
    selector: 'axis'
})
@View({
  template: `
  <svg>
    <template>
      <rect [attr.width]="graph.width" height="5" 
            x="0" [attr.y]="graph.height + 5"
            style="fill:rgb(255,0,9);stroke-width:3;stroke:rgb(0,0,0)" />
    </template>
  </svg>
  `
})
class Axis {
  graph: Graph;
  
  constructor(@Parent() graph: Graph) {
    this.graph = graph;
    this.graph.addAxis(this);
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
}

bootstrap(MyAppComponent);

