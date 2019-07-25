import React, {Component} from 'react';
let ThemeContext = createContext('theme');
// let ThemeContext = React.createContext('theme');
function createContext(){
    class Provider extends React.Component{
        static value;
        constructor(props){
            super(props);
            Provider.value= props.value
            this.state = {value:props.value};
        }
        static getDerivedStateFromProps(nextProps, prevState) {
            Provider.value = nextProps.value
            return {value:nextProps.value};
        }
        render(){
            return this.props.children;
        }
    }
    class Consumer extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            return this.props.children(Provider.value);
        }
    }
    return {
        Provider,
        Consumer
    }
}

class Header extends Component {
    render() {
        return (
            <div style={{ border: '5px solid blue', padding: 5 }}>
                header
                <Title />
            </div>
        )
    }
}

function Title(props) {
    return (
        <ThemeContext.Consumer>
            {
                value => (
                    <div style={{ color: value.color, border: '5px solid orange' }}>
                        title
                    </div>
                )
            }
        </ThemeContext.Consumer>

    )
}
class Main extends Component {
    render() {
        return (
            <div style={{ border: '5px solid green', margin: 5, padding: 5 }}>
                main
                <Content />
            </div>
        )
    }
}
class Content extends Component {
    static contextType = ThemeContext;
    render() {
        return (
            <ThemeContext.Consumer>
                {
                    value => (
                        <div style={{ color: value.color, border: '5px solid purple', padding: 5 }}>
                            Content
                        <button onClick={() => value.changeColor('green')}>绿色</button>
                            <button onClick={() => value.changeColor('orange')}>橙色</button>
                        </div>
                    )
                }
            </ThemeContext.Consumer>


        )
    }
}
class Page extends Component {
    constructor() {
        super();
        this.state = { color: 'red' };
    }
    changeColor = (color) => {
        this.setState({ color })
    }
    render() {
        let contextVal = { color: this.state.color, changeColor: this.changeColor };
        return (
            <ThemeContext.Provider value={contextVal}>
                <div style={{ border: '5px solid red', padding: 5, width: 200 }}>
                    page
                <Header />
                    <Main />
                </div>
            </ThemeContext.Provider>

        )
    }
}
export default Page;