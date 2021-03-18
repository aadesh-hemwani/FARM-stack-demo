import React, { Component } from 'react';
import ListItems from './ListItems.js'
import {Consumer} from '../Context'

export default class List extends Component {
    displayListDetails(index, dispatch){
        dispatch({
            type: 'DISPLAY_INDEX',
            payload: index
        })
    }

    render() {
        return (
            <Consumer>
                {value =>{
                    const {lists, dispatch} = value;
                    return(
                        <ul>
                            {lists.map((data, index) =>
                            (<li key={index}>
                                <div className="list" onClick={this.displayListDetails.bind(this, index, dispatch)}>
                                    <ListItems data={data} index={index}/>
                                </div>
                            </li>))}
                        </ul>

                    )
                }}
            </Consumer>
        )
    }
}
