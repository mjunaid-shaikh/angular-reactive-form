import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from 'src/app/_config/CONFIG';
import { HttpService } from 'src/app/service/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {

  itemCount: Array<number> = [];
  directionCount: Array<number> = [];

  UUID: any;
  fileImage: any;

  constructor(private fb: FormBuilder, private httpService: HttpService) {
    this.httpService.getUUID(`${CONFIG.getUUID}`, this.UUID).subscribe((data: any) => {
      localStorage.setItem('token', data?.data);
    })
  }

  // defining form group
  addForm: FormGroup = new FormGroup({})



  ngOnInit(): void {

    // form initializing
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      summary: ['', Validators.required],
      rating: ['', Validators.required],
      isVegNonveg: ['', Validators.required],
    })

    this.addIngredentsItem();
    this.adddirection();
    this.UUID = uuidv4();


  }

  // getting the value for the form input validation
  get title() {
    return this.addForm.get('title');
  }
  get image() {
    return this.addForm.get('image');
  }
  get summary() {
    return this.addForm.get('summary');
  }
  get rating() {
    return this.addForm.get('rating');
  }
  get isVegNonveg() {
    return this.addForm.get('isVegNonveg');
  }




  // adding items for ingredents
  addIngredentsItem() {
    let ingradient: Array<any> = []

    if (this.itemCount.length <= 0) {
      this.itemCount.push(0);
    }

    else {
      this.itemCount.push((this.itemCount[this.itemCount.length - 1]) + 1);
    }

    let index = this.itemCount[this.itemCount.length - 1]

    this.addForm.addControl('ingredentsQty' + index, this.fb.control('', []));
    this.addForm.addControl('ingredentsDtls' + index, this.fb.control('', []));


    this.itemCount.map((items: any, index: number) => {
      console.log('dd', items);

      let ReqObj = {
        steps: items
      }
    })

  }



  // 
  handleUpload(event: any) {
    this.fileImage = event?.target?.files[0]?.name;
  }



  // removing items for ingredents
  removeIngredentsItem(itemNumber: any, index: number) {

    let filterTab = this.itemCount.indexOf(itemNumber);
    this.itemCount.splice(filterTab, 1)

    this.addForm.removeControl('ingredentsQty' + itemNumber);
    this.addForm.removeControl('ingredentsDtls' + itemNumber);
  }




  // adding items for ingredents
  adddirection() {
    if (this.directionCount.length <= 0) {
      this.directionCount.push(0);
    }
    else {
      this.directionCount.push((this.directionCount[this.directionCount.length - 1]) + 1);
    }

    let index = this.directionCount[this.directionCount.length - 1]

    this.addForm.addControl('directionSteps' + index, this.fb.control('', [Validators.required]));
    this.addForm.addControl('directionDtls' + index, this.fb.control('', [Validators.required]));
  }



  // remove direction 
  removeDirection(directionNumber: any, index: number) {
    let filterTab = this.directionCount.indexOf(directionNumber);
    this.directionCount.splice(filterTab, 1)

    this.addForm.removeControl('directionSteps' + directionNumber);
    this.addForm.removeControl('directionDtls' + directionNumber);
  }




  // add form submission
  formSubmit() {
    let ingradientArr: Array<any> = [];
    let directionArr: Array<any> = [];


    // getting ingredients data
    this.itemCount.map((data: any, index: number) => {
      let reqItemObj = {
        steps: this.addForm.get('ingredentsQty' + data)?.value.trim(),
        desc: this.addForm.get('ingredentsDtls' + data)?.value.trim(),
      }
      ingradientArr.push(reqItemObj);
    })


    // getting direction data
    this.directionCount.map((data: any, index: number) => {
      let reqDirectionObj = {
        steps: this.addForm.get('directionSteps' + data)?.value.trim(),
        desc: this.addForm.get('directionDtls' + data)?.value.trim(),
      }
      directionArr.push(reqDirectionObj)
    });


    let reqPayload = {
      title: this.addForm.get('title')?.value.trim(),
      summary: this.addForm.get('summary')?.value.trim(),
      rating: this.addForm.get('rating')?.value.trim(),
      dish: this.addForm.get('isVegNonveg')?.value.trim(),
      photo: this.fileImage,
      ingradient: ingradientArr,
      direction: directionArr,
      token: localStorage.getItem('token'),
    }
    console.log('rere', reqPayload);


    this.httpService.postAddForm(`${CONFIG.addForm}`, reqPayload).subscribe((data: any) => {
      if (data?.status) {
        console.log('submitted Successfully', data);
        window.location.reload();
      }
    })

  }
}
