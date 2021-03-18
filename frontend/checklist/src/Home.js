import React, { Component } from 'react'
import List from './components/List.js'
import Sidemenu from './components/Sidemenu.js'
import {Consumer} from './Context'

export default class Home extends Component {
    render() {
        return(
            <Consumer>             
                {value =>{
                    const {isLoaded, error, lists} = value;
                    if(error){
                        return <div>Error: {error.message}</div>;
                    }
                    else if(!isLoaded){
                        return <div className="loading">Loading</div>;
                    }
                    else if(lists.length === 0){
                        return (
                        <>
                            <div className="text_wrapper">
                                <div style={{"fontSize": "3rem"}}>U have 0 Lists, try adding some</div>
                            </div>
                            <Sidemenu />
                        </>
                        );
                    }
                    else{
                        return (<>
                            <List lists={lists} />
                            <Sidemenu />
                        </>)
                    }
                }}
            </Consumer>
        );
    }
}