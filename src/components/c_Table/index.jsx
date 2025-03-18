import { Table, Pagination } from 'antd'

const Index = (props) => {
  let { table, pagination } = props

  return (
    <div class='c_table'>
      <Table pagination={false} {...table} />
      {pagination && (
        <div class='pagination'>
          <Pagination
            showSizeChanger={false}
            showTitle={false}
            defaultCurrent={1}
            defaultPageSize={10}
            {...pagination}
          />
        </div>
      )}
    </div>
  )
}

export default Index