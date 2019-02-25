import React,{PureComponent} from 'react';
import cytoscape from 'cytoscape';
import './cyto.scss';
import EC2 from './EC2'
import VPC from './VPC'
import RDS from './RDS'
import AvailabilityZone from './AvailabilityZone'
import cola from 'cytoscape-cola';

cytoscape.use( cola );
class Cyto extends PureComponent{
  constructor(props){
    super(props);
    this.renderElement = this.renderElement.bind(this);
    this.makeEdges = this.makeEdges.bind(this);
    this.cy = null;
    // this.nodes should hold each node's id and specific data - pro: constant lookup time for each node, con: takes up storage space
    // alternatively we could find a way to access specific data per node from state
    this.state = {
      nodes:{},
    };
  }
  // function call to render a cytoscape object (entire graph)
  renderElement(){
    let getNodeFunction = this.props.getNodeDetails;
    let getStateNodes = this.state.nodes;
    // creates new cytoscape object and sets format for graph
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      boxSelectionEnabled: false,
      autounselectify: true,
      // styling format for each element of the object (nodes, edges, etc.)
      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'height': 80,
            'width': 80,
            'background-fit': 'cover',
            'background-color': 'white',
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5,
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': 5,
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
          .selector('.EC2')
          .css({
              'background-color':'pink'
          })
          .selector('.RDS')
          .css({
              'background-color':'orange'
          })
        });
        /**
         *  VPCs just pass in the id
         *  Availability Zone pass in the ID and the VPC's ID
         *  EC2( data, parent, source)
         *  S3 ( data, parent, source )
         */
         //check to see if you can access parent of the current node to pass into function
      this.cy.on('tap', 'node', function (evt){
        console.log('this is the id:', this.id());
        console.log('this is getStateNodes:',getStateNodes)
        console.log('where r u',getStateNodes[this.id()]);
        getNodeFunction(getStateNodes[this.id()] );
      })
  }
      // invokes the function to create object
  componentDidMount(){
    this.renderElement();
  }

  makeEdges(cy){
    console.log("hello my edges is ", this.props.edgeTable)
    const outboundIds = Object.keys(this.props.edgeTable);
    for(let i = 0; i < outboundIds.length; i++ ){
      const inboundIdsSet = this.props.edgeTable[outboundIds[i]];
      inboundIdsSet.forEach( function(val1, val2, set){
        cy.add({ group: 'edges', data: { id: outboundIds[i]+val1, source: outboundIds[i], target: val1}});
      });
    }
  }
  
  render(){
    // clears old graph when new graph is invoked
    if(this.cy ) {
      this.cy.$('node').remove();
    }
    // iterate through everything in state to gather VPC, availability zone, EC2 and RDS instances and creating nodes for each
    for(let vpc in this.props.regionData){
      let vpcObj = this.props.regionData[vpc];
      this.cy.add(new VPC(vpc).getVPCObject());
      for(let az in vpcObj){
        this.cy.add(new AvailabilityZone(az,vpc).getAvailabilityZoneObject());
        let ec2Instances = vpcObj[az].EC2;
        for(let ec2s in ec2Instances){
          this.cy.add(new EC2(ec2Instances[ec2s], vpc+'-'+az, null).getEC2Object());
          this.state.nodes[ec2s] = [ec2s,"EC2",az,vpc];
        }
        let rdsInstances = vpcObj[az].RDS;
        for (let rds in rdsInstances) {
          this.cy.add(new RDS(rdsInstances[rds], vpc+'-'+az, null).getRDSObject());
          this.state.nodes[rds] = [rds,"RDS",az,vpc];
        }
        //make edges for nodes
      }
    }
    this.makeEdges(this.cy);
    console.log('heeeeeeeeeey',this.state.nodes);

    // ensures that the above collected information gets formatted in the cola layout, then run it
    if(this.cy){
      this.cy.layout({name: 'cola', flow: { axis: 'y', minSeparation: 40}, avoidOverlap: true}).run();
    }
    return(
        <div className="node_selected">
            <div id="cy"></div>
        </div>
    )
  }        
};

export default Cyto;