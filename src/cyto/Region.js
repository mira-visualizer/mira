export default class Region {
  constructor(id){
    this.id = id;
  }

  getRegionObject(){
    return {data: {id: this.id, label: this.id}, classes: "Region"}
  }
}