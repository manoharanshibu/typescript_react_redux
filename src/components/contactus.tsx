import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import { email, alphaNumeric2 } from '../utils/RegExp';

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
  save: (message: Object) => void
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
    dispatch(saveData({ message })),
})


class ContactUsComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}> {

  errors = {
    email: 'Please provide a valid email address',
    name: 'Please enter a valid name',
    message: 'Please enter message',
  };

  state = {
    emailValid: true,
    nameValid: true,
    messageValid: true,
  }

  isValidated() {

    this.state.emailValid = email.test((this.refs.email as any)['value'])
    this.state.nameValid = alphaNumeric2.test((this.refs.name as any)['value']) && ((this.refs.name as any)['value'].length > 2);
    this.state.messageValid = (this.refs.message as any)['value'].length > 0
    
    if (!this.state.messageValid) {
      (this.refs.message as any)['className'] = 'form-coformntrol-error';
      (this.refs.message as any).focus();
    } else {
      (this.refs.message as any)['className'] = 'form-control';
    }
    
    if (!this.state.emailValid) {
      (this.refs.email as any)['className'] = 'form-control-error';
      (this.refs.email as any).focus();
    } else {
      (this.refs.email as any)['className'] = 'form-control';
    }

    if (!this.state.nameValid) {
      (this.refs.name as any)['className'] = 'form-control-error';
      (this.refs.name as any).focus();
    } else {
      (this.refs.name as any)['className'] = 'form-control';
    }

    this.forceUpdate();
    return (this.state.emailValid && this.state.nameValid && this.state.messageValid);
  }

  _onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.isValidated()) return;
    if (!this.props.isSaving) {
      const name = this.refs.name as any
      const email = this.refs.email as any
      const message = this.refs.message as any
      this.props.save({ name: name['value'], email: email['value'], message: message['value'] })
    }
  }

  _onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.props.isLoading) {
      this.props.load();
    }
  }

  componentDidMount() {
    (this.refs.name as any).focus();
  }

  render() {
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
              <input
                ref="name"
                autoComplete="off"
                type="text"
                defaultValue=''
                placeholder="Please enter name."
                className="form-control"
                  />
              {this.state.nameValid === false && <div className="error-box">
                <label className="error-text">{this.errors.name}</label></div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-cell label">
              Email:
                </div>
            <div className="form-cell input">
              <input
                ref="email"
                autoComplete="off"
                type="email"
                placeholder="shibu@shibu.com"
                className="form-control"
                />
              {this.state.emailValid === false && <div className="error-box">
                <label className="error-text">{this.errors.email}</label>
              </div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-cell label">
              Message:
                </div>
            <div className="form-cell textarea">
              <textarea ref="message" className="form-control" />
              {this.state.messageValid === false && <div className="error-box">
                <label className="error-text">{this.errors.message}</label>
              </div>}
            </div>
          </div>
        </div>
        <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
        <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{isLoading ? 'loading...' : 'load'}</button>
        {error ? <div className='error'>{error}</div> : null}
      </form>
    </div>
  }
}

export const ContactUs: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(ContactUsComponent)
