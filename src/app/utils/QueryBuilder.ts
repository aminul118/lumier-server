/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'mongoose';
import { excludeField } from '../constant';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;
  private filterQuery: Record<string, string> = {};
  private searchQuery: Record<string, any> = {};

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /** Apply filters from query */
  filter(): this {
    const filter: Record<string, any> = Object.fromEntries(
      Object.entries(this.query).filter(([key]) => !excludeField.includes(key)),
    );

    // Handle comma separated values for $in and case-insensitive matching for specific fields
    Object.keys(filter).forEach((key) => {
      const value = filter[key];
      if (typeof value === 'string') {
        if (value.includes(',')) {
          filter[key] = { $in: value.split(',') };
        } else if (['category', 'subCategory', 'type'].includes(key)) {
          // Exact match but case-insensitive
          filter[key] = { $regex: `^${value}$`, $options: 'i' };
        }
      }
    });

    this.filterQuery = filter;
    this.modelQuery = this.modelQuery.find(this.filterQuery);

    return this;
  }

  /** Apply search on searchable fields */
  search(searchableField: string[]): this {
    const searchTerm =
      this.query.search || this.query.searchTerm || this.query.q || '';
    if (!searchTerm) return this;

    this.searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    };

    this.modelQuery = this.modelQuery.find(this.searchQuery);
    return this;
  }

  /** Sorting */
  sort(): this {
    const sort = this.query.sort || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  /** Select specific fields */
  fields(): this {
    const fields = this.query.fields?.split(',').join(' ') || '';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /** Pagination */
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /** Build the query */
  build() {
    return this.modelQuery;
  }

  /** Get meta for pagination */
  async getMeta() {
    // Use the actual filter from the query object to include base conditions (like isDeleted: false)
    const filter = this.modelQuery.getFilter();
    const totalDocuments = await this.modelQuery.model.countDocuments(filter);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
