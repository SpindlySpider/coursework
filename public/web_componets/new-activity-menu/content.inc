<div id="content">
    <input id="activityNameInput" placeholder="title" class="bottomsheet-content-item">
    <textarea id="descriptionInput" placeholder="descrption" class="bottomsheet-content-item"></textarea>
    <div id="photo-duration-container"style="display: flex;width: 90vw;justify-content: space-between;">
      <label id="add-photo-label" for="addPhoto" style="font-size: 9vw;text-align: center;align-self: center;background-color: var(--button-colour);border-radius: 3vw;padding: 2vh 3vw;">add photo</label>
      <input id="addPhoto" type="file" accept="image/jpeg, image/png, image/jpg,image/gif"  style="display:none">
      <duration-picker id="timeInput"></duration-picker>
    </div>
    <tag-input id="tag"></tag-input>
</div>
