export default class VPC {
  constructor(id){
    this.id = id;
  }

  getVPCObject(){
    return {data: {id: this.id, label: this.id}, classes: "VPC"}
  }
}