export default class AvailabilityZone {
  constructor(id, parent){
    this.id = id;
    this.parent = parent;
  }

  getAvailabilityZoneObject(){
      return { data: { id: this.id, parent:this.parent, label: this.id}, classes: "availabilityZone"};
  }
}