import React,{Component} from 'react';
import cytoscape from 'cytoscape';
import './cyto.css';
import EC2 from './EC2'
import S3 from './S3'
import VPC from './VPC'
import AvailabilityZone from './AvailabilityZone'
import cola from 'cytoscape-cola';

cytoscape.use( cola );

class Cyto extends Component{
  constructor(props){
    super(props);
    this.renderElement = this.renderElement.bind(this);
    this.cy = null;
    this.nodes = {};
    // console.log(data);

  }
  renderElement(){
    this.cy = cytoscape({
      container: document.getElementById('cy'),
    
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'cola',
        flow: { axis: 'y', minSeparation: 40 },
        avoidOverlap: true
      },

      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'height': 80,
            'width': 80,
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5,
            'text-halign': 'center',
            'text-valign': 'center',
            'label': 'data(label)'


          })
        .selector(':parent')
          .css({
            'font-weight': 'bold',
            'background-opacity': 0.075,
            'content': 'data(label)',
            'text-valign': 'top',
          })
          .selector('edge')
          .css({
            'curve-style': 'bezier',
            'width': 6,
            'target-arrow-shape': 'triangle',
            'line-color': '#ffaaaa',
            'target-arrow-color': '#ffaaaa',
            'opacity': 0.5
          })
          
        });
      
        /**
         *  VPCs just pass in the id
         *  Availability Zone pass in the ID and the VPC's ID
         *  EC2( data, parent, source)
         *  S3 ( data, parent, source )
         */

      this.cy.add(new VPC("vpc-d2681ab7").getVPCObject());
      this.cy.add(new AvailabilityZone("us-west-2b","vpc-d2681ab7").getAvailabilityZoneObject());
      this.cy.add(new EC2({id:0}, "us-west-2b" , null).getEC2Object());
      this.cy.add(new EC2({id:1}, "us-west-2b" , 0).getEC2Object());
      this.cy.add(new AvailabilityZone("us-west-1a","vpc-d2681ab7").getAvailabilityZoneObject());
      this.cy.add(new EC2({id:2}, "us-west-1a", 1).getEC2Object());
      this.cy.add(new S3({id: 3},"us-west-2b",1).getS3Object());

        this.cy.on('tap', 'node', function (evt){
          console.log("The id of the node clicked is ", this.id());
        })
      }

      componentDidMount(){
        this.renderElement();
        this.cy.layout({name: 'cola', flow: { axis: 'y', minSeparation: 40}, avoidOverlap: true}).run();

        // 
      }

      render(){
        return(
            <div className="node_selected">
                <div id="cy"></div>
            </div>
        )
    }
          
};

export default Cyto;