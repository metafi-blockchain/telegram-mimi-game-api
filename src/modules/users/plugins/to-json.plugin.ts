import { Schema, Document } from 'mongoose';

/**
 * A utility function to delete a nested path from an object.
 */
const deleteAtPath = (obj: Record<string, any>, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

/**
 * Mongoose schema plugin to modify the toJSON transform call:
 * - Removes __v, createdAt, updatedAt, and any path with { private: true }
 * - Replaces _id with id
 */
const toJSON = (schema: Schema) => {
  // Store any existing transform function
  let transform: ((doc: Document, ret: Record<string, any>, options: any) => any) | undefined;
  if (schema.get('toJSON')?.transform) {
    const toJSONOptions = schema.get('toJSON');
    if (toJSONOptions && typeof toJSONOptions.transform === 'function') {
      transform = toJSONOptions.transform;
    }
  }

  schema.set('toJSON', {
    transform(doc: Document, ret: Record<string, any>, options: any) {
      // Remove paths marked as private
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // Replace _id with id
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // Uncomment if you want to remove createdAt and updatedAt
      // delete ret.createdAt;
      // delete ret.updatedAt;

      // If there's an existing transform function, call it
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;