import React,{Component} from 'react';
import { connect } from 'react-redux';
import cytoscape from 'cytoscape';
import './cyto.scss';
import EC2 from './EC2'
import S3 from './S3'
import VPC from './VPC'
import RDS from './RDS'
import AvailabilityZone from './AvailabilityZone'
import cola from 'cytoscape-cola';

cytoscape.use( cola );
// const mapStateToProps = store => ({
//     regionData: store.regionData
//     // ec2: store.graph.ec2Instances,
//   })
class Cyto extends Component{
  constructor(props){
    super(props);
    this.renderElement = this.renderElement.bind(this);
    this.cy = null;
    this.nodes = {};
    console.log(this.props);
  }
  renderElement(){
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      boxSelectionEnabled: false,
      autounselectify: true,
      // layout: {
      //   name: 'cola',
      //   flow: { axis: 'y', minSeparation: 40 },
      //   avoidOverlap: true
      // },
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

         this.cy.on('tap', 'node', function (evt){
          console.log("The id of the node clicked is ", this.id());
          // instance id of each item (ec2 or rds, etc.)
          // we want to update state of side panel to be this active node
          // if there is an active state, we will change state to empty string
            // if the active state is empty we will change state to show information
        })
      }

      componentDidMount(){
        this.renderElement();
      }
      render(){
        
        if(this.cy) {
          this.cy.$('node').remove();
        }
        for(let vpc in this.props.regionData){
          let vpcObj = this.props.regionData[vpc];
          this.cy.add(new VPC(vpc).getVPCObject());
          for(let az in vpcObj){
            this.cy.add(new AvailabilityZone(az,vpc).getAvailabilityZoneObject());
            let ec2Instances = vpcObj[az].EC2;
            for(let ec2s in ec2Instances){
              this.cy.add(new EC2(ec2Instances[ec2s], az, null).getEC2Object());
            }

            let rdsInstances = vpcObj[az].RDS;
            for (let rds in rdsInstances) {
              this.cy.add(new RDS(rdsInstances[rds], az, null).getRDSObject());
            }
            //do the exact same thing for rds'
            //make edges for nodes
          }
        }
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