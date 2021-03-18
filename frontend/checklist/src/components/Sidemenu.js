import React, { Component } from 'react'
import DonutChart from 'react-donut-chart';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import {Consumer} from '../Context'

export default class Sidemenu extends Component {
    constructor(props){
        super();
        this.state={
            showAddList: false,
            showAddItem: false,
            newItemName: "",
            newListTitle: "",
            newListCreator: "",
        }
        this.months = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
        }
    }
    handleChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
          [name]: value,
        });
    };
    createCheckList(dispatch){
        if(this.state.newListCreator !== "" && this.state.newListTitle !== ""){
            let date = new Date();
            let time;
            if(date.getHours() > 12) time = date.getHours()%12+":"+date.getMinutes()+" PM";
            else time = date.getHours()+":"+date.getMinutes()+" AM";
            let d= date.getDate()+ " " + this.months[date.getMonth()]+ ", " + date.getFullYear() + " at " + time;

            let url = "/checklist/";
            let formData = new FormData();
            formData.append("title", this.state.newListTitle);
            formData.append("author_name", this.state.newListCreator);
            formData.append("created", d);
            
            let object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            let json = JSON.stringify(object);

            fetch(url,{
                method: "post",
                body: json,
            }).then((response) => response.json())
            .then(data => {
                dispatch({
                    type: 'ADD_LIST',
                    payload: data
                })
            })
            this.handleListM();

            this.setState({
                newListTitle : "",
                newListCreator : ""
            })
        }
    }
    addItemToList(id, dispatch){
        if(this.state.newItemName !== ""){
            let url = `/checklist/add_item/${id}`;
            let formData = new FormData();
            formData.append("item_name", this.state.newItemName);           
            
            let object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            let json = JSON.stringify(object);

            fetch(url,{
                method: "post",
                body: json,
            })
    
            this.handleItemM();
            dispatch({
                type: 'ADD_ITEM',
                payload: [id, this.state.newItemName]
            })
            this.setState({
                newItemName: ""
            })

        }
    }
    handleItemM() {
        this.setState({
            showAddItem: !this.state.showAddItem
        });
    }
    handleListM() {
        this.setState({
            showAddList: !this.state.showAddList
        });
    }

    render() {       
        return (
            <Consumer>
                {(value) =>{
                    let {lists, displayListIndex} = value;
        
                    let checked = 0, unchecked = 0;
                    let listTitle = "", listId = "";
                    if(lists.length !== 0 && displayListIndex < lists.length){
                        const items = lists[displayListIndex]["items"];
                        listTitle = lists[displayListIndex]["title"];
                        listId = lists[displayListIndex]["_id"];

                        if(items.length !== 0){
                            for(let i=0; i<items.length; i++){
                                if(items[i]["isChecked"]){
                                    checked++;
                                }
                            }
                            unchecked = items.length - checked;
                        }
                    }
                    return(
                        <div className="sidemenu">
                            <div className="sidebody">
                                <div className="sidemenu-nav">
                                    <div className="checklist_heading" >Checklist</div>
                                    <button className="addListBtn" title="add new list" onClick={this.handleListM.bind(this)}>+</button>
                                </div>
                                <div className="chart">
                                    <DonutChart
                                        legend={false}
                                        height={300}
                                        width={300}
                                        clickToggle={false}
                                        startAngle={270}
                                        innerRadius={0.75}
                                        selectedOffset={0}
                                        strokeColor={'transparent'}
                                        colors={['#5edb4b', '#db4b4d']}
                                        data={[{
                                            label: 'Done',
                                            value: checked
                                        },
                                        {
                                            label: 'Pending',
                                            value: unchecked,
                                        }]} />
                                </div>
                                {lists.length !== 0 && displayListIndex < lists.length?
                                    <>
                                        <div>
                                            <p className="sm_details">Title: <b className="sm_details">{listTitle}</b></p>
                                            <p className="sm_details">By:    <b className="sm_details">{lists[displayListIndex].author_name}</b></p>
                                            <p className="sm_details">Date:  <b className="sm_details">{lists[displayListIndex].created}</b></p> 
                                        </div>
                                        {lists[displayListIndex].title !== "" ?
                                            <div className="create_list">
                                                <button onClick={this.handleItemM.bind(this)} className="newListBtn">Add Item to {lists[displayListIndex].title}</button>
                                            </div>
                                            : null
                                        }
                                    </>
                                    : null
                                }
                                
                            </div>
                            <Modal 
                                classNames={{
                                modal: 'customModal',
                                }} open={this.state.showAddItem} onClose={this.handleItemM.bind(this)} center>
                                <div className="modal_title">Add Item to {listTitle}</div>
                                <div className="modal_form">
                                    <input 
                                        className="input" 
                                        name="newItemName" 
                                        value={this.state.newItemName} 
                                        onChange={this.handleChange} 
                                        type="text" 
                                        placeholder="Item Name"
                                    />
                                    <div className="modal_btns">
                                        <button 
                                            className="createList" 
                                            onClick={this.addItemToList.bind(this, listId, value.dispatch)}>
                                                Add
                                        </button>
                                        <button 
                                            className="closeModal" 
                                            onClick={this.handleItemM.bind(this)}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal 
                                classNames={{
                                modal: 'customModal',
                                }} open={this.state.showAddList} onClose={this.handleListM.bind(this)} center>
                                <div className="modal_title">Create New Checklist</div>
                                <div className="modal_form">
                                    <input 
                                        className="input" 
                                        name="newListTitle" 
                                        value={this.state.newListTitle} 
                                        onChange={this.handleChange} 
                                        type="text" 
                                        placeholder="Title"
                                    />
                                    <input 
                                        className="input" 
                                        name="newListCreator" 
                                        value={this.state.newListCreator} 
                                        onChange={this.handleChange} 
                                        type="text" 
                                        placeholder="Creator Name"
                                    />
                                    <div className="modal_btns">
                                        <button 
                                            className="createList" 
                                            onClick={this.createCheckList.bind(this, value.dispatch)}>
                                            create
                                        </button>
                                        <button 
                                            className="closeModal" 
                                            onClick={this.handleListM.bind(this)}>
                                            close
                                        </button>
                                    </div>
                                </div>
                                </Modal>
                        </div>
                    )
                }}
            </Consumer>    
        )
    }
}
