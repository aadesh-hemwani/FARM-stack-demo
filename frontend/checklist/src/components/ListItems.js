import React, { Component } from 'react'
import {Consumer} from '../Context'

export default class ListItems extends Component {
    constructor(props){
        super();
        this.state = {
            showList: false,
            items: props.data.items,
        }
    }

    deleteList(id, dispatch){
        let url = `/checklist/${id}`;
        fetch(url,{
            method: "delete"
        });
        dispatch({
            type: 'DELETE_LIST',
            payload: id
        })
    }
    deleteListItem(list_id, index, dispatch){
        let url = `/checklist/${list_id}/${index}`;
        
        fetch(url,{
            method: "delete"
        })
        dispatch({
            type: 'DELETE_LIST_ITEM',
            payload: {id: list_id, index: index}
        })
    }

    toggleChecked(list_id, index, dispatch){
        let url = `/checklist/${list_id}/${index}`;
        
        fetch(url,{
            method: "put"
        })
        .then((response) => response.json())
        .then(data => {
            this.setState({ 
                items: data["items"],
            });
        })
    }

    handleShow(){
        this.setState({
            showList: ! this.state.showList
        })
    }

    render() {
        let checkedItemClassNames = "checkedItem";
        let uncheckedItemClassNames = "item";
        const {_id, title, created} = this.props.data;
        return (
            <Consumer>
                {(value) =>{
                    return (
                        <div>
                            <div className="row" onClick={this.handleShow.bind(this)}>
                                <div className="title">{title}</div>
                                <div className="inner-details">
                                    <div className="created">{created}</div>
                                    <button className="deleteBtn" onClick={this.deleteList.bind(this, _id, value.dispatch)}>X</button>
                                </div>
                            </div>
                            {this.state.showList ? 
                                    <ul className="itemsList">
                                    {this.state.items.map((data, index) => 
                                        <li 
                                            key={index} 
                                            onClick={this.toggleChecked.bind(this, this.props.data._id, index, value.dispatch )}  
                                            className={data.isChecked ? checkedItemClassNames : uncheckedItemClassNames}>
                                            {data.item_name}
                                            <div className="inner-details">
                                            {data.isChecked ? <div>Done</div> : <div>Pending</div>}
                                            <button className="deleteBtn" onClick={this.deleteListItem.bind(this, this.props.data._id, index, value.dispatch)}>X</button>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                                : null}
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}
