
class Renderer {
  constructor(view) {
    console.log('creating renderer: ', view)
    this.view = view
  }

  clear = () => {
    console.log('renderer::clear()')
  }

  updateStyle = (s) => {
    // inherited classes should overload this!
    console.log('renderer::updateStyle()')
  }

  render = () => {
    // inherited classes should overload this!
    console.log('renderer::render()')
  }
}

export default Renderer
