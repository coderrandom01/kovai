export function validateFormData(type: string, formData: Record<string, any>) {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'category':
      errors.name = formData.name ? '' : 'Enter category name';
      errors.parent = ''; // optional or can add logic
      errors.status = ''; // status (boolean) doesn't need validation
      errors.image = formData.image ? '' : 'Select an image';
      break;
    case 'listing':
      errors.title = formData.title.trim() ? '' : 'Enter title';
      errors.description = formData.description.trim() ? '' : 'Enter description';
      errors.price = formData.price ? '' : 'Enter price';
      errors.discount_percent = formData.discount_percent ? '' : 'Enter discount percent';
      errors.images = formData.images?.length > 0 ? '' : 'Add at least one image';
      errors.category = formData.category ? '' : 'Select a category';
      break;
    // case 'listing':
    //   errors.title = formData.title ? '' : 'Enter title';
    //   errors.price = formData.price ? '' : 'Enter price';
    //   errors.images = formData.images && formData.images.length > 0 ? '' : 'Add at least one image';
    //   // add more fields...
    //   break;

    // case 'user':
    //   errors.username = formData.username ? '' : 'Enter username';
    //   errors.email = formData.email ? '' : 'Enter email';
    //   break;

    default:
      throw new Error(`Unknown form type: ${type}`);
  }

  return errors;
}