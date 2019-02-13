export default class AvailabilityZone {
  constructor(id, parent){
    this.id = id;
    this.parent = parent;
  }

  getAvailabilityZoneObject(){
    console.log("parent",this.parent)
      return { data: { id: this.id, parent:this.parent, label: this.id}, classes: "availabilityZone"};
  }
}