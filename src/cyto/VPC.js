export default class VPC {
  constructor(id, parent){
    this.id = id;
    this.parent = parent;

  }

  getVPCObject(){
    return {data: {id: this.parent+'-'+this.id, parent:this.parent, label: this.id}, classes: "VPC"}
  }
}