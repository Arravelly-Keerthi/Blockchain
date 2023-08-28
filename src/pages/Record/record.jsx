import React from 'react';
import './Record.css'
export default function Record({publicKeyPatient,recordsRef,data,submitDiagnosis,index}) {
    
  return (
    <div>
      <div className="tab-content">
                <div id={`view${publicKeyPatient}`}>
                  <div className="row">
                    <div className="col-sm-12">
                      <pre style={{ margin: "20px 0" }} ref={recordsRef} id={`records${publicKeyPatient}`}>
                        {data}
                      </pre>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="row">
                        <div className="form-group col-sm-10">
                          <div className="row">
                            <div className="col-sm-2">
                              <label htmlFor={`ailmentsList${publicKeyPatient}`} className="control-label">
                                Diagnosis:
                              </label>
                            </div>
                            <div className="col-sm-10">
                              <select className="form-control" id={`ailmentsList${publicKeyPatient}`} style={{ width: "inherit" }} required>
                                <option selected disabled>
                                  -- Please Select --
                                </option>
                                <option value="0">Common Flu</option>
                                <option value="1">Viral Infection</option>
                                <option value="2">Cancer</option>
                                <option value="3">Tumor</option>
                                <option value="4">Covid-19</option>
                                <option value="5">Heart-Disorder</option>
                                <option value="6">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-sm-10">
                          <div className="row">
                            <div className="col-sm-2">
                              <label className="control-label" htmlFor="details">
                                Details:
                              </label>
                            </div>
                            <div className="col-sm-10">
                              <textarea
                                className="form-control"
                                rows="5"
                                id="details"
                                placeholder="Enter details to be added"
                                name="Details"
                                style={{ width: "inherit" }}
                                required
                                autoFocus
                              ></textarea>
                              {/* <input type="text" className="form-control" id="details" placeholder="Enter details to be added" name="Details" style="width: inherit" required autofocus> */}
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-sm-2">
                          <button className="btn btn-primary" onClick={() => submitDiagnosis(document.getElementById(`ailmentsList${publicKeyPatient}`).value, document.getElementById("details").value,index)}>
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </div>
  )
}
