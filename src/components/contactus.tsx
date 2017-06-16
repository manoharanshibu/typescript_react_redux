import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import {
  loadData,
  saveData,
} from '../actions'

import { Store } from '../reducers';

type OwnProps = {
}

type ConnectedState = {
  data: { message?: Object },
  isSaving: boolean,
  isLoading: boolean,
  error: string,
}

type ConnectedDispatch = {
  save: (message:Object) => void
  load: () => void
}

const mapStateToProps = (state: Store.All, ownProps: OwnProps): ConnectedState => ({
  data: state.data,
  isSaving: state.isSaving,
  isLoading: state.isLoading,
  error: state.error,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
  load: () =>
    dispatch(loadData()),
  save: (message: Object) =>  
    dispatch(saveData({message})),
})

class ContactUsComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {

  _onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSaving) {
      const name = this.refs.name as any
      const email = this.refs.email as any
      const message = this.refs.message as any
      this.props.save({name: name['value'], email: email['value'], message: message['value']})
    }
  }

  _onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isLoading) {  
      this.props.load();
    }
  }

  render () {
    const { data, isSaving, isLoading, error } = this.props;
    return <div>
      <div>
        <div>{Object(data.message).name}</div>
        <div>{Object(data.message).email}</div>
        <div>{Object(data.message).message}</div>
      </div>
      <form>
               
        <div className="form">
            <div className="form-row">
                <div className="form-cell label">
                    Name:
                </div>
                <div className="form-cell input">
                    <input id="name" type="text" ref="name" />
                </div>
            </div>            
       
            <div className="form-row">
                <div className="form-cell label">
                    Email:
                </div>
                <div className="form-cell input">
                    <input type="text" ref="email" />
                </div>
            </div> 
            <div className="form-row">
                <div className="form-cell label">
                    Message:
                </div>
                <div className="form-cell textarea">
                    <textarea ref="message" />
                </div>
            </div>         
        </div>
        <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
        <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{ isLoading ? 'loading...' : 'load'}</button>
        { error ? <div className='error'>{error}</div> : null }
      </form>
    </div>
  }
}

export const ContactUs: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(ContactUsComponent)
