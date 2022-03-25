const React = require('react');
class HelloWorld extends React.Component {


  render() {
    return (
      <div>

        <h1>{ '%message%' }</h1>
        <h2>{ '%error.status%' }</h2>
        <pre>{ '%error.stack%' }</pre>
      </div>
    )
  }
}
module.exports = HelloWorld;