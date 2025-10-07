import BookCard from '../BookCard'
import mathCover from '@assets/generated_images/Math_textbook_cover_design_8295278d.png'

export default function BookCardExample() {
  return (
    <div className="p-8 max-w-xs">
      <BookCard
        id="1"
        title="Advanced Mathematics for O-Level"
        author="Dr. T. Moyo"
        level="O-Level"
        form="Form 4"
        coverUrl={mathCover}
        fileName="advanced_math_olevel.pdf"
        downloads={2340}
        isTrending={true}
      />
    </div>
  )
}
