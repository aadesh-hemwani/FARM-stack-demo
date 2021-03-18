import React, { Component } from 'react'
const Context = React.createContext();
const reducer = (state, action) =>{
    switch(action.type){
        case 'GET_LISTS':
            console.log("here")
            let url = "/checklist/";
            fetch(url,{
                method: "get"
            })
            .then((response) => response.json())
            .then(data => {
                return {
                    ...state,
                    lists: data
                }
            })
            return state

        case 'ADD_LIST':
            if(state.lists.filter(list => list._id === action.payload._id).length === 0 ){
                state.lists.push(action.payload)
            }
            return state

        case 'DISPLAY_INDEX':
            return {
                ...state,
                displayListIndex: action.payload
            }
        
        case 'DELETE_LIST':
            return {
                ...state,
                lists: state.lists.filter(list => list._id !== action.payload),
                displayListIndex: state.displayListIndex - 1
            }
        
        case 'DELETE_LIST_ITEM':    
            let id = action.payload.id;
            let index = action.payload.index;
            state.lists.filter(list => list._id === id)[0]["items"].splice(index, 1);
            return state
            
        
        case 'ADD_ITEM':
            let item_list = state.lists.filter(list => list._id === action.payload[0])[0]["items"];
            let item = {
                item_name: action.payload[1],
                isChecked: false
            }
            item_list.push(item);
            return state

        default:
            return state;
    }
}

export class Provider extends Component {
    constructor(){
        super();
        this.state = {
            error: "",
            isLoaded: false,
            lists: [],
            displayListIndex: 0,
            dispatch: (action) =>{
                this.setState(function(state) {
                    return reducer(state, action);
                });
            }
        }
    }

    componentDidMount(){
        let url = "/checklist/";
        fetch(url,{
            method: "get"
        })
        .then((response) => response.json())
        .then(data => {
            this.setState({ 
                lists: data,
                isLoaded: true,
            });
        }).catch((e)=>{
            this.setState({
                isLoaded: true,
                error: e
            })
        });        
    }
    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const Consumer = Context.Consumer;