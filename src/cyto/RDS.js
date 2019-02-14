class RDS {
  constructor(data, parent, source){
    this.data = data;
    this.id = data.DbiResourceId;
    this.name = data.DBName;
    this.source = source;
    this.parent = parent;
  }

  getRDSObject(){
    if(this.source !== null){
      return [
        {group: 'nodes', data: { id: this.id, parent:this.parent, label: "RDS-"+this.name}, classes: 'RDS'},
        { group: 'edges', data: { id: this.id+this.source, source: this.source, target: this.id}}
      ]
    }
    else{
      return {group: 'nodes', data: { id: this.id, parent:this.parent,label: "RDS-"+this.name}, classes: 'RDS'}
    }
  }

}

export default RDS;