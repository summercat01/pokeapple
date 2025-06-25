interface ScoreDisplayProps {
  score: number
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="text-2xl font-bold text-gray-800 mb-4">
      점수: {score}
    </div>
  )
}
